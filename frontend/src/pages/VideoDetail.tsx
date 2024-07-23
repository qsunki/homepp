import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useVideoStore } from '../store/useVideoStore';
import DetailPlayer from '../components/DetailPlayer';
import DetailList from '../components/DetailList';

const VideoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { setSelectedVideoId, setLiveThumbnailUrl } = useVideoStore();

  useEffect(() => {
    if (id) {
      setSelectedVideoId(Number(id));
    }
  }, [id, setSelectedVideoId]);

  useEffect(() => {
    const fetchLiveThumbnail = async () => {
      try {
        const response = await fetch('/cams/live/thumbnail');
        const data = await response.json();
        setLiveThumbnailUrl(data.thumbnailUrl);
      } catch (error) {
        console.error('Error fetching live thumbnail:', error);
      }
    };

    fetchLiveThumbnail();
  }, [setLiveThumbnailUrl]);

  return (
    <div className="flex justify-center bg-white px-16 py-8">
      <div className="w-full max-w-6xl flex space-x-4">
        <DetailPlayer showDetails={true} />
        <DetailList showLiveThumbnail={true} />
      </div>
    </div>
  );
};

export default VideoDetail;
