import React, { useCallback, useEffect } from 'react';
import { useCameraStore } from '../stores/useCameraStore';
import { fetchLatestEnvInfo } from '../api';

interface CameraToggleProps {
  onToggle?: (status: boolean) => void;
}

const CameraToggle: React.FC<CameraToggleProps> = ({ onToggle }) => {
  const { camIds, isCamerasOn, fetchCamIds, setCamerasOn } = useCameraStore();

  // 카메라 상태를 가져오는 함수
  const fetchCameraStatus = useCallback(async () => {
    try {
      if (camIds.length > 0) {
        const firstCamStatus = await fetchLatestEnvInfo(camIds[0]);
        const status = firstCamStatus.status === 'RECORDING';
        setCamerasOn(status);
        if (onToggle) onToggle(status);
      } else {
        // console.log('No camera IDs available');
      }
    } catch (error) {
      // console.error('Failed to fetch camera statuses:', error);
    }
  }, [camIds, setCamerasOn, onToggle]);

  // 카메라 ID 목록을 가져오는 useEffect
  useEffect(() => {
    fetchCamIds();
  }, [fetchCamIds]);

  // 카메라 상태를 가져오는 useEffect
  useEffect(() => {
    if (camIds.length > 0) {
      fetchCameraStatus();
    }
  }, [camIds, fetchCameraStatus]);

  return (
    <div className="relative flex items-center justify-center group">
      <svg
        height="30px"
        width="30px"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 30.143 30.143"
        fill={isCamerasOn ? '#007bff' : 'black'}
        className="cursor-pointer"
      >
        <circle
          cx="15"
          cy="15"
          r="14"
          fill={isCamerasOn ? '#f0f0f0' : 'none'}
          className={isCamerasOn ? 'drop-shadow-md' : ''}
        />
        <g>
          <path d="M20.034,2.357v3.824c3.482,1.798,5.869,5.427,5.869,9.619c0,5.98-4.848,10.83-10.828,10.83 c-5.982,0-10.832-4.85-10.832-10.83c0-3.844,2.012-7.215,5.029-9.136V2.689C4.245,4.918,0.731,9.945,0.731,15.801 c0,7.921,6.42,14.342,14.34,14.342c7.924,0,14.342-6.421,14.342-14.342C29.412,9.624,25.501,4.379,20.034,2.357z"></path>
          <path d="M14.795,17.652c1.576,0,1.736-0.931,1.736-2.076V2.08c0-1.148-0.16-2.08-1.736-2.08 c-1.57,0-1.732,0.932-1.732,2.08v13.496C13.062,16.722,13.225,17.652,14.795,17.652z"></path>
        </g>
      </svg>
    </div>
  );
};

export default CameraToggle;
