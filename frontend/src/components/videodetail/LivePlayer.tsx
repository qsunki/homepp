import React, { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import Loader from './Loader';

interface Signal {
  type: 'answer' | 'candidate';
  data: RTCSessionDescriptionInit | RTCIceCandidateInit;
}

interface Cam {
  id: string;
  name: string;
}

const LivePlayer: React.FC = () => {
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [peerConnection, setPeerConnection] =
    useState<RTCPeerConnection | null>(null);
  const [cams, setCams] = useState<Cam[]>([]);
  const [selectedCamId, setSelectedCamId] = useState<string>('1'); // 기본적으로 캠1을 선택
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // 캠 리스트 조회
    const fetchCams = async () => {
      try {
        const response = await fetch('/api/v1/cams', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setCams(data);
      } catch (error) {
        console.error('Failed to fetch cams:', error);
      }
    };

    fetchCams();
  }, []);

  useEffect(() => {
    if (!selectedCamId) return;

    // 캠 선택 후 WebSocket 키 조회 (주석 처리됨)
    /*
    const fetchWebSocketKey = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/v1/cams/${selectedCamId}/stream`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setWebSocketKey(data.key); // 서버 응답에 따라 key 값을 설정합니다.
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch WebSocket key:', error);
        setIsLoading(false);
      }
    };

    fetchWebSocketKey();
    */
    setIsLoading(false); // WebSocket 키 조회가 주석 처리되었으므로 로딩 상태를 바로 false로 설정
  }, [selectedCamId]);

  useEffect(() => {
    if (isLoading) return; // 로딩 중일 때는 실행하지 않음

    const webSocketKey = '123'; // 테스트용 키값

    console.log('Initializing WebSocket and STOMP client...');

    const socketUrl = `https://i11a605.p.ssafy.io:8081/ws`;
    const socket = new SockJS(socketUrl);

    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('STOMP client connected');
        stompClient.subscribe(`/sub/client/${webSocketKey}`, (message) => {
          const signal: Signal = JSON.parse(message.body);
          console.log('Received signal:', signal);
          handleSignal(signal);
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error:', frame.headers['message']);
        console.error('Additional details:', frame.body);
      },
      onDisconnect: () => {
        console.log('STOMP client disconnected');
      },
    });

    stompClient.activate();
    console.log('STOMP client activation requested');

    const pc = new RTCPeerConnection();
    setPeerConnection(pc);
    console.log('RTCPeerConnection created:', pc);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('ICE candidate event:', event.candidate);
        stompClient.publish({
          destination: `/pub/client/${webSocketKey}`,
          body: JSON.stringify({
            type: 'candidate',
            data: event.candidate.toJSON(),
          }),
        });
        console.log('Published ICE candidate:', event.candidate.toJSON());
      }
    };

    pc.ontrack = (event) => {
      console.log('Track event:', event);
      if (remoteVideoRef.current) {
        const [remoteStream] = event.streams;
        remoteVideoRef.current.srcObject = remoteStream;
        console.log('Remote stream set to video element');
      }
    };

    pc.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    }).then((offer) => {
      pc.setLocalDescription(offer);
      console.log('Created and set local description:', offer);
      stompClient.publish({
        destination: `/pub/client/${webSocketKey}`,
        body: JSON.stringify({ type: 'offer', data: offer }),
      });
      console.log('Published offer:', offer);
    });

    return () => {
      console.log('Deactivating STOMP client and closing RTCPeerConnection');
      stompClient.deactivate();
      if (pc) {
        pc.close();
      }
    };
  }, [isLoading, selectedCamId]);

  const handleSignal = (signal: Signal) => {
    if (!peerConnection) {
      console.error('No RTCPeerConnection available to handle signal');
      return;
    }

    switch (signal.type) {
      case 'answer':
        console.log('Handling answer signal:', signal.data);
        peerConnection.setRemoteDescription(
          new RTCSessionDescription(signal.data as RTCSessionDescriptionInit)
        );
        break;
      case 'candidate':
        console.log('Handling candidate signal:', signal.data);
        peerConnection.addIceCandidate(
          new RTCIceCandidate(signal.data as RTCIceCandidateInit)
        );
        break;
      default:
        console.warn('Unknown signal type:', signal.type);
        break;
    }
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
        className="w-full h-auto"
      />
    </div>
  );
};

export default LivePlayer;
