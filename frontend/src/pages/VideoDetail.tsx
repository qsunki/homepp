import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useVideoStore } from '../stores/useVideoStore';
import DetailPlayer from '../components/videodetail/DetailPlayer';
import DetailList from '../components/videodetail/DetailList';

const VideoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    setSelectedVideoId,
    setLiveThumbnailUrl,
    filteredVideos,
    selectedTypes,
    setSelectedTypes,
  } = useVideoStore();

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

  const handleTypeToggle = (type: string) => {
    const newSelectedTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];
    setSelectedTypes(newSelectedTypes);
  };

  return (
    <div className="flex justify-center bg-white px-4 md:px-16 py-8">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
        <DetailPlayer showDetails={true} />
        <DetailList
          showLiveThumbnail={true}
          videos={filteredVideos}
          selectedTypes={selectedTypes}
          onTypeToggle={handleTypeToggle}
          listHeight="300px" // 목록 부분 높이 조정
        />
      </div>
    </div>
  );
};

export default VideoDetail;
