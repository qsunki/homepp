import React, { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

interface Signal {
  type: 'answer' | 'candidate';
  data: RTCSessionDescriptionInit | RTCIceCandidateInit;
}

const LivePlayer: React.FC = () => {
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [peerConnection, setPeerConnection] =
    useState<RTCPeerConnection | null>(null);

  useEffect(() => {
    console.log('Initializing WebSocket and STOMP client...');

    const socketUrl = `https://i11a605.p.ssafy.io:8081/ws`;
    const socket = new SockJS(socketUrl);

    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('STOMP client connected');
        stompClient.subscribe('/sub/client/123', (message) => {
          const signal: Signal = JSON.parse(message.body);
          console.log('Received signal:', signal);
          handleSignal(signal);
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error:', frame.headers['message']);
        console.error('Additional details:', frame.body);
      },
    });

    stompClient.activate();

    const pc = new RTCPeerConnection();
    setPeerConnection(pc);
    console.log('RTCPeerConnection created:', pc);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('ICE candidate event:', event.candidate);
        stompClient.publish({
          destination: '/pub/client/123',
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
        destination: '/pub/client/123',
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
  }, []);

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
