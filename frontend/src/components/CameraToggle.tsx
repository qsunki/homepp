import React, { useEffect } from 'react';
import { useCameraStore } from '../stores/useCameraStore';
import { controlAllCamerasStream, fetchLatestEnvInfo } from '../api';

const CameraToggle: React.FC = () => {
  const { camIds, isCamerasOn, fetchCamIds, setCamerasOn, webSocketKey } =
    useCameraStore();

  useEffect(() => {
    fetchCamIds(); // 컴포넌트가 로드될 때 camIds를 불러옴

    const fetchCameraStatus = async () => {
      try {
        if (camIds.length > 0) {
          // 첫 번째 카메라의 상태를 가져와서 확인
          const firstCamStatus = await fetchLatestEnvInfo(camIds[0]);

          // 첫 번째 카메라의 상태가 RECORDING이면 isCamerasOn을 true로 설정
          setCamerasOn(firstCamStatus.status === 'RECORDING');
        }
      } catch (error) {
        console.error('Failed to fetch camera statuses:', error);
      }
    };

    fetchCameraStatus(); // 초기 로드 시 카메라 상태 확인
  }, [camIds, setCamerasOn]);

  const handleToggle = async () => {
    const command = isCamerasOn ? 'end' : 'start';
    const confirmationMessage = isCamerasOn
      ? 'Are you sure you want to turn off the detection mode for all cameras?'
      : 'Are you sure you want to turn on the detection mode for all cameras?';

    const confirmed = window.confirm(confirmationMessage);

    if (confirmed) {
      try {
        await controlAllCamerasStream(camIds, command, webSocketKey);
        console.log(
          `All cameras stream ${command} command executed successfully.`
        );
        setCamerasOn(!isCamerasOn);

        if (!isCamerasOn) {
          // 수동으로 카메라를 켠 경우 상태를 RECORDING으로 설정
          await fetchLatestEnvInfo(camIds[0]);
        }
      } catch (error) {
        console.error('Failed to toggle all cameras:', error);
      }
    }
  };

  return (
    <div className="relative flex items-center justify-center group">
      <input
        id="checkbox"
        type="checkbox"
        checked={isCamerasOn}
        onChange={handleToggle}
        className="hidden"
      />
      <label htmlFor="checkbox" className="cursor-pointer">
        <svg
          height="22px"
          width="22px"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 30.143 30.143"
          xmlSpace="preserve"
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
      </label>
      <span
        className={`absolute -bottom-12 left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 text-sm font-medium text-white bg-gray-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap`}
      >
        {isCamerasOn ? 'Detection OFF' : 'Detection ON'}
      </span>
    </div>
  );
};

export default CameraToggle;
