import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useVideoStore } from '../store/useVideoStore';
import DetailPlayer from '../components/DetailPlayer';
import DetailList from '../components/DetailList';

const LiveVideo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { setSelectedVideoId } = useVideoStore();

  useEffect(() => {
    if (id) {
      setSelectedVideoId(Number(id));
    }
  }, [id, setSelectedVideoId]);

  return (
    <div className="flex justify-center bg-white px-16 py-8">
      <div className="w-full max-w-6xl flex space-x-4">
        <DetailPlayer isLive={true} />
        <DetailList />
      </div>
    </div>
  );
};

export default LiveVideo;
