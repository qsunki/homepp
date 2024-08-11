import React, { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';
import { v4 as uuidv4 } from 'uuid'; // UUID를 사용해 랜덤 키 생성
// import Loader from './Loader'; // 로딩 컴포넌트 임포트 주석 처리
import { fetchCams, CamData } from '../../api';
import record from '../../assets/livevideo/record.png';
import stop from '../../assets/livevideo/stop.png';
import { controlCameraStream } from '../../api';

interface Signal {
  type: 'answer' | 'candidate' | 'offer';
  data: RTCSessionDescriptionInit | RTCIceCandidateInit;
}

interface Cam {
  id: string;
  name: string;
}

const LivePlayer: React.FC = () => {
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const [cams, setCams] = useState<Cam[]>([]);
  const [selectedCamId, setSelectedCamId] = useState<string>('1');
  // const [isLoading, setIsLoading] = useState<boolean>(true);
  const clientRef = useRef<Client | null>(null);
  const [webSocketKey, setWebSocketKey] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const getCams = async () => {
      try {
        const response = await fetchCams();
        console.log('Fetched cams:', response.data);
        const camsData: Cam[] = response.data.map((cam: CamData) => ({
          id: cam.camId.toString(),
          name: cam.name,
        }));
        setCams(camsData);
      } catch (error) {
        console.error('Failed to fetch cams:', error);
      }
    };

    getCams();
  }, []);

  useEffect(() => {
    if (!selectedCamId) return;

    // WebSocket 키를 프론트에서 직접 생성
    const generateWebSocketKey = () => {
      const key = uuidv4(); // UUID를 사용해 랜덤 키 생성
      console.log('Generated WebSocket key:', key);
      setWebSocketKey(key);
    };

    generateWebSocketKey();
  }, [selectedCamId]);

  useEffect(() => {
    if (!webSocketKey) return;

    console.log(
      'Initializing WebSocket and STOMP client with key:',
      webSocketKey
    );

    const socketUrl = `https://i11a605.p.ssafy.io/ws`;
    const socket = new SockJS(socketUrl);

    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        console.log('STOMP Debug: ', str);
      },
      onConnect: (frame) => {
        console.log('STOMP client connected, frame:', frame);
        client.subscribe(`/sub/client/${webSocketKey}`, (message: IMessage) => {
          console.log('Received message:', message);
          const signal: Signal = JSON.parse(message.body);
          console.log('Received signal:', signal);
          handleSignal(signal);
        });
        sendOffer();
      },
      onStompError: (frame) => {
        console.error('Broker reported error:', frame.headers['message']);
        console.error('Additional details:', frame.body);
      },
      onDisconnect: () => {
        console.log('STOMP client disconnected');
      },
    });

    clientRef.current = client;
    client.activate();
    console.log('STOMP client activation requested');

    return () => {
      console.log('Deactivating STOMP client');
      client.deactivate();
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      // 페이지를 떠날 때 스트리밍 종료 요청
      controlCameraStream(parseInt(selectedCamId), 'END').catch((error) => {
        console.error(
          `Failed to stop stream for camId ${selectedCamId}:`,
          error
        );
      });
    };
  }, [webSocketKey, selectedCamId]);

  const handleSignal = (signal: Signal) => {
    console.log('Handling signal:', signal);

    const iceConfiguration = {
      iceServers: [
        {
          urls: 'stun:i11a605.p.ssafy.io',
          username: 'username',
          credential: 'password',
        },
        {
          urls: 'turn:i11a605.p.ssafy.io',
          username: 'username',
          credential: 'password',
        },
      ],
    };

    let peerConnection = peerConnectionRef.current;
    if (!peerConnection) {
      peerConnection = new RTCPeerConnection(iceConfiguration);
      peerConnectionRef.current = peerConnection;

      peerConnection.onicecandidate = (event) => {
        console.log('icecandidate event occurred', event);
        if (event.candidate && clientRef.current?.connected) {
          console.log('Publishing ICE candidate:', event.candidate);
          clientRef.current.publish({
            destination: `/pub/client/${webSocketKey}`,
            body: JSON.stringify({
              type: 'candidate',
              data: event.candidate,
            }),
          });
        }
      };

      peerConnection.ontrack = (event) => {
        console.log('Track event occurred:', event);
        const [remoteStream] = event.streams;
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
          console.log('Remote stream set to video element');
          // setIsLoading(false);

          // Initialize MediaRecorder when track event occurs
          if (mediaRecorderRef.current == null) {
            const mediaRecorder = new MediaRecorder(remoteStream);
            mediaRecorder.ondataavailable = (e) => {
              if (e.data.size > 0) {
                recordedChunksRef.current.push(e.data);
              }
            };
            mediaRecorderRef.current = mediaRecorder;
          }
        }
      };
    }

    switch (signal.type) {
      case 'offer':
        console.log('Handling offer signal:', signal.data);
        if (peerConnection) {
          peerConnection
            .setRemoteDescription(
              new RTCSessionDescription(
                signal.data as RTCSessionDescriptionInit
              )
            )
            .then(() => {
              console.log('Remote description set successfully.');
              if (peerConnection) {
                return peerConnection.createAnswer();
              }
            })
            .then((answer) => {
              if (peerConnection && answer) {
                return peerConnection
                  .setLocalDescription(answer)
                  .then(() => answer);
              }
            })
            .then((answer) => {
              if (clientRef.current?.connected && answer) {
                clientRef.current.publish({
                  destination: `/pub/client/${webSocketKey}`,
                  body: JSON.stringify({ type: 'answer', data: answer }),
                });
                console.log('Published answer:', answer);
              }
            })
            .catch((error) => {
              console.error('Failed to handle offer:', error);
            });
        }
        break;
      case 'answer':
        console.log('Handling answer signal:', signal.data);
        if (peerConnection) {
          peerConnection
            .setRemoteDescription(
              new RTCSessionDescription(
                signal.data as RTCSessionDescriptionInit
              )
            )
            .then(() => {
              console.log('Remote description set successfully.');
            })
            .catch((error) => {
              console.error('Failed to set remote description:', error);
            });
        }
        break;
      case 'candidate':
        console.log('Handling candidate signal:', signal.data);
        if (peerConnection) {
          peerConnection
            .addIceCandidate(
              new RTCIceCandidate(signal.data as RTCIceCandidateInit)
            )
            .then(() => {
              console.log('ICE candidate added successfully.');
            })
            .catch((error) => {
              console.error('Failed to add ICE candidate:', error);
            });
        }
        break;
      default:
        console.warn('Unknown signal type:', signal.type);
        break;
    }
  };

  const sendOffer = () => {
    if (!clientRef.current?.connected) {
      console.error('STOMP client is not connected');
      return;
    }

    const pc = new RTCPeerConnection({
      iceServers: [
        {
          urls: 'stun:i11a605.p.ssafy.io',
          username: 'username',
          credential: 'password',
        },
        {
          urls: 'turn:i11a605.p.ssafy.io',
          username: 'username',
          credential: 'password',
        },
      ],
    });
    peerConnectionRef.current = pc;
    console.log('RTCPeerConnection created:', pc);

    pc.onicecandidate = (event) => {
      console.log('icecandidate event occurred', event);
      if (event.candidate && clientRef.current?.connected) {
        console.log('Publishing ICE candidate:', event.candidate);
        clientRef.current.publish({
          destination: `/pub/client/${webSocketKey}`,
          body: JSON.stringify({
            type: 'candidate',
            data: event.candidate,
          }),
        });
      }
    };

    pc.ontrack = (event) => {
      console.log('Track event occurred:', event);
      const [remoteStream] = event.streams;
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
        console.log('Remote stream set to video element');
        // setIsLoading(false);
      }
    };

    pc.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    })
      .then((offer) => {
        console.log('Offer created:', offer);
        return pc.setLocalDescription(offer).then(() => offer);
      })
      .then((offer) => {
        console.log('Publishing offer:', offer);
        if (clientRef.current?.connected) {
          clientRef.current.publish({
            destination: `/pub/client/${webSocketKey}`,
            body: JSON.stringify({ type: 'offer', data: offer }),
          });
        }
      })
      .catch((error) => {
        console.error('Failed to create offer:', error);
      });
  };

  const handleRecord = () => {
    if (isRecording) {
      // Stop recording
      mediaRecorderRef.current?.stop();
      setIsRecording(false);

      // Save the recorded video
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'recording.webm';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      recordedChunksRef.current = [];
    } else {
      // Start recording
      recordedChunksRef.current = [];
      mediaRecorderRef.current?.start();
      setIsRecording(true);
    }
  };

  return (
    <div className="relative">
      {/* 로딩 컴포넌트 주석 처리 */}
      {/* {isLoading && <Loader />} */}
      <select
        className="absolute top-4 left-4 bg-white border border-gray-400 rounded px-2 py-1 z-10"
        onChange={(e) => setSelectedCamId(e.target.value)}
        value={selectedCamId || ''}
      >
        <option value="" disabled>
          Select a cam
        </option>
        {cams.map((cam) => (
          <option key={cam.id} value={cam.id}>
            {cam.name}
          </option>
        ))}
      </select>
      <div className="relative">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          controls
          className="w-full h-auto"
        />
      </div>
      <div className="flex justify-between items-center mt-4 px-2">
        <div className="text-3xl font-bold">LIVE VIDEO</div>
        <img
          src={isRecording ? stop : record}
          alt={isRecording ? 'Stop Recording' : 'Start Recording'}
          className="w-auto h-8"
          onClick={handleRecord}
        />
      </div>
    </div>
  );
};

export default LivePlayer;
