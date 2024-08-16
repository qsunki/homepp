import React, { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';
import { v4 as uuidv4 } from 'uuid';
import {
  fetchCams,
  CamData,
  controlCameraStream,
  fetchSharedCams,
  SharedCamData,
} from '../../api';
import record from '../../assets/livevideo/record.png';
import stop from '../../assets/livevideo/stop.png';

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
  const [sharedCams, setSharedCams] = useState<Cam[]>([]);
  const [selectedCamId, setSelectedCamId] = useState<string>('');
  const clientRef = useRef<Client | null>(null);
  const [webSocketKey, setWebSocketKey] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isLive, setIsLive] = useState<boolean>(false); // 라이브 상태를 추적
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const getCams = async () => {
      try {
        const response = await fetchCams();
        const camsData: Cam[] = response.data.map((cam: CamData) => ({
          id: cam.camId.toString(),
          name: cam.name,
        }));
        setCams(camsData);
        if (camsData.length > 0) {
          setSelectedCamId(camsData[0].id);
        }
      } catch (error) {
        // console.error('Failed to fetch cams:', error);
      }
    };

    const getSharedCams = async () => {
      try {
        const response = await fetchSharedCams();
        const sharedCamsData: Cam[] = response.data.map(
          (cam: SharedCamData) => ({
            id: cam.camId.toString(),
            name: cam.name,
          })
        );
        setSharedCams(sharedCamsData);
      } catch (error) {
        // console.error('Failed to fetch shared cams:', error);
      }
    };

    getCams();
    getSharedCams();
  }, []);

  useEffect(() => {
    if (!selectedCamId) return;

    const generateWebSocketKey = () => {
      const key = uuidv4();
      setWebSocketKey(key);
    };

    generateWebSocketKey();
  }, [selectedCamId]);

  useEffect(() => {
    if (!webSocketKey || !selectedCamId) return;

    const startStream = async () => {
      try {
        await controlCameraStream(
          parseInt(selectedCamId),
          'start',
          webSocketKey
        );
      } catch (error) {
        // console.error(
        //   `Failed to start stream for camId ${selectedCamId}:`,
        //   error
        // );
      }
    };

    startStream();

    const socketUrl = `https://i11a605.p.ssafy.io/ws`;
    const socket = new SockJS(socketUrl);

    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        // console.log('STOMP Debug: ', str);
      },
      onConnect: (frame) => {
        // console.log('STOMP client connected, frame:', frame);
        client.subscribe(`/sub/client/${webSocketKey}`, (message: IMessage) => {
          const signal: Signal = JSON.parse(message.body);
          handleSignal(signal);
        });
      },
      onStompError: (frame) => {
        // console.error('Broker reported error:', frame.headers['message']);
        // console.error('Additional details:', frame.body);
      },
      onDisconnect: () => {
        // console.log('STOMP client disconnected');
      },
    });

    clientRef.current = client;
    client.activate();
    // console.log('STOMP client activation requested with key:', webSocketKey);

    return () => {
      // console.log('Deactivating STOMP client with key:', webSocketKey);
      client.deactivate();
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      controlCameraStream(parseInt(selectedCamId), 'end', webSocketKey).catch(
        (error) => {
          // console.error(
          //   `Failed to stop stream for camId ${selectedCamId}:`,
          //   error
          // );
        }
      );
      setIsLive(false); // 라이브 상태를 false로 설정
    };
  }, [webSocketKey, selectedCamId]);

  const handleSignal = async (signal: Signal) => {
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
        if (event.candidate && clientRef.current?.connected) {
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
        const [remoteStream] = event.streams;
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
          setIsLive(true); // 라이브 상태를 true로 설정

          if (!mediaRecorderRef.current) {
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

    if (signal.type === 'offer') {
      await handleOffer(signal.data as RTCSessionDescriptionInit);
    } else if (signal.type === 'candidate') {
      await addCandidate(signal.data as RTCIceCandidateInit);
    }
  };

  const handleOffer = async (offer: RTCSessionDescriptionInit) => {
    const peerConnection = peerConnectionRef.current;
    if (peerConnection) {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      if (clientRef.current?.connected) {
        clientRef.current.publish({
          destination: `/pub/client/${webSocketKey}`,
          body: JSON.stringify({ type: 'answer', data: answer }),
        });
      }
    }
  };

  const addCandidate = async (candidate: RTCIceCandidateInit) => {
    const peerConnection = peerConnectionRef.current;
    if (peerConnection) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  const handleRecord = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);

      const webmBlob = new Blob(recordedChunksRef.current, {
        type: 'video/webm',
      });

      const { createFFmpeg, fetchFile } = await import('@ffmpeg/ffmpeg');
      const ffmpeg = createFFmpeg({ log: true });

      await ffmpeg.load();
      ffmpeg.FS('writeFile', 'input.webm', await fetchFile(webmBlob));
      await ffmpeg.run('-i', 'input.webm', 'output.mp4');

      const mp4Data = ffmpeg.FS('readFile', 'output.mp4');
      const mp4Blob = new Blob([mp4Data.buffer], { type: 'video/mp4' });
      const mp4Url = URL.createObjectURL(mp4Blob);

      const camName =
        cams.find((cam) => cam.id === selectedCamId)?.name || 'recording';
      const timeStamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `${camName}-${timeStamp}.mp4`;

      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = mp4Url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(mp4Url);

      recordedChunksRef.current = [];
    } else {
      recordedChunksRef.current = [];
      mediaRecorderRef.current?.start();
      setIsRecording(true);
    }
  };

  return (
    <div className="relative">
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

        {sharedCams.length > 0 && <option disabled>---</option>}

        {sharedCams.map((cam) => (
          <option key={cam.id} value={cam.id}>
            {cam.name} (shared)
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
        {isLive && (
          <img
            src={isRecording ? stop : record}
            alt={isRecording ? 'Stop Recording' : 'Start Recording'}
            className="w-auto h-8"
            onClick={handleRecord}
          />
        )}
      </div>
    </div>
  );
};

export default LivePlayer;
