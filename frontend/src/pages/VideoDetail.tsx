import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useVideoStore } from '../stores/useVideoStore';
import DetailPlayer from '../components/videodetail/DetailPlayer';
import DetailList from '../components/videodetail/DetailList';

const VideoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // URL에서 비디오 ID를 가져옴
  const {
    setSelectedVideoId,
    setLiveThumbnailUrl,
    filteredVideos,
    selectedTypes,
    setSelectedTypes,
    selectedVideo, // selectedVideo를 상태에서 가져옴
    isThreat, // isThreat 상태를 가져옴
    setIsThreat, // isThreat 상태를 업데이트할 함수
  } = useVideoStore();

  useEffect(() => {
    if (id) {
      setSelectedVideoId(Number(id)); // 선택된 비디오 ID를 상태로 설정
    }
  }, [id, setSelectedVideoId]);

  useEffect(() => {
    const fetchLiveThumbnail = async () => {
      try {
        const response = await fetch('/cams/live/thumbnail'); // 라이브 썸네일 가져오기
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

  // 신고 여부를 토글하는 함수
  const handleThreatToggle = () => {
    setIsThreat(!isThreat);
  };

  return (
    <div className="flex justify-center bg-white px-4 md:px-16 py-8">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
        <DetailPlayer showDetails={true} />{' '}
        {/* Correctly passing showDetails to DetailPlayer */}
        <DetailList
          showLiveThumbnail={true} // This is correct and expected by DetailList
          videos={filteredVideos}
          selectedTypes={selectedTypes}
          onTypeToggle={handleTypeToggle}
          listHeight="300px" // 목록 부분 높이 조정
        />
        {/* 선택된 비디오의 정보를 추가로 표시 */}
        {selectedVideo && (
          <div className="selected-video-info">
            <h2>{selectedVideo.title}</h2>
            <p>{selectedVideo.timestamp}</p>
            <button onClick={handleThreatToggle}>
              {isThreat ? 'Unreport' : 'Report'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoDetail;
