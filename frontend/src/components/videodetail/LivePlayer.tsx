import React, { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';
import Loader from './Loader';
import { fetchCams, CamData } from '../../api';

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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const clientRef = useRef<Client | null>(null);

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

    setIsLoading(false);
  }, [selectedCamId]);

  useEffect(() => {
    if (isLoading) return;

    console.log('Initializing WebSocket and STOMP client with key:', '123');

    const socketUrl = `http://i11a605.p.ssafy.io:8081/ws`;
    const socket = new SockJS(socketUrl);

    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        console.log('STOMP Debug: ', str);
      },
      onConnect: (frame) => {
        console.log('STOMP client connected, frame:', frame);
        client.subscribe(`/sub/client/123`, (message: IMessage) => {
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
    };
  }, [isLoading]);

  const handleSignal = (signal: Signal) => {
    console.log('Handling signal:', signal);
    const peerConnection = peerConnectionRef.current;

    if (!peerConnection) {
      console.error('No RTCPeerConnection available to handle signal');
      return;
    }

    switch (signal.type) {
      case 'offer':
        console.log('Handling offer signal:', signal.data);
        peerConnection
          .setRemoteDescription(
            new RTCSessionDescription(signal.data as RTCSessionDescriptionInit)
          )
          .then(() => {
            console.log('Remote description set successfully.');
            return peerConnection.createAnswer();
          })
          .then((answer) => {
            return peerConnection
              .setLocalDescription(answer)
              .then(() => answer);
          })
          .then((answer) => {
            if (clientRef.current?.connected) {
              clientRef.current.publish({
                destination: `/pub/client/123`,
                body: JSON.stringify({ type: 'answer', data: answer }),
              });
              console.log('Published answer:', answer);
            }
          })
          .catch((error) => {
            console.error('Failed to handle offer:', error);
          });
        break;
      case 'answer':
        console.log('Handling answer signal:', signal.data);
        peerConnection
          .setRemoteDescription(
            new RTCSessionDescription(signal.data as RTCSessionDescriptionInit)
          )
          .then(() => {
            console.log('Remote description set successfully.');
          })
          .catch((error) => {
            console.error('Failed to set remote description:', error);
          });
        break;
      case 'candidate':
        console.log('Handling candidate signal:', signal.data);
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

    const pc = new RTCPeerConnection();
    peerConnectionRef.current = pc;
    console.log('RTCPeerConnection created:', pc);

    pc.onicecandidate = (event) => {
      console.log('icecandidate event occurred', event);
      if (event.candidate && clientRef.current?.connected) {
        console.log('Publishing ICE candidate:', event.candidate);
        clientRef.current.publish({
          destination: `/pub/client/123`,
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
            destination: `/pub/client/123`,
            body: JSON.stringify({ type: 'offer', data: offer }),
          });
        }
      })
      .catch((error) => {
        console.error('Failed to create offer:', error);
      });
  };

  return (
    <div>
      {isLoading && <Loader />}
      <h1>Cam List</h1>
      <select
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
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        controls
        className="w-full h-auto"
      />
    </div>
  );
};

export default LivePlayer;
