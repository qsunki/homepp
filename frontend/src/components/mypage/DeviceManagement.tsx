import React, { useState } from 'react';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import { useDeviceStore } from '../../stores/useDeviceStore';
import { useUserStore } from '../../stores/useUserStore'; // 사용자 스토어 임포트
import QRCode from 'qrcode'; // QR 코드 라이브러리 임포트
import checkIcon from '../../assets/mypage/check.png';
import cancelIcon from '../../assets/mypage/cancel.png';

const DeviceManagement: React.FC = () => {
  const devices = useDeviceStore((state) => state.devices);
  const addDevice = useDeviceStore((state) => state.addDevice);
  const deleteDevice = useDeviceStore((state) => state.deleteDevice);
  const editDevice = useDeviceStore((state) => state.editDevice);
  const userEmail = useUserStore((state) => state.email); // 사용자 이메일 가져오기

  const [editingDevice, setEditingDevice] = useState<number | null>(null);
  const [newDeviceName, setNewDeviceName] = useState<string>('');
  const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(
    null
  );
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null); // QR 코드 URL 상태 추가
  const [showQRCodePopup, setShowQRCodePopup] = useState<boolean>(false); // QR 코드 팝업 상태 추가

  const handleEditDevice = (id: number) => {
    setEditingDevice(id);
    const device = devices.find((device) => device.id === id);
    setNewDeviceName(device ? device.name : '');
  };

  const handleSaveDeviceName = (id: number) => {
    if (newDeviceName.trim() === '') return;
    editDevice(id, newDeviceName);
    setEditingDevice(null);
    setNewDeviceName('');
  };

  const handleCancelEdit = () => {
    setEditingDevice(null);
    setNewDeviceName('');
  };

  const handleAddDevice = async () => {
    // 사용자 이메일로 QR 코드 생성
    try {
      const qrCodeData = `mailto:${userEmail}`; // QR 코드 데이터 (예: 이메일 링크)
      const url = await QRCode.toDataURL(qrCodeData);
      setQrCodeUrl(url);
      setShowQRCodePopup(true); // QR 코드 팝업을 표시
      addDevice('New Device');
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: number
  ) => {
    if (e.key === 'Enter') {
      handleSaveDeviceName(id);
    }
  };

  const handleDeleteDevice = (id: number) => {
    setDeleteConfirmation(id);
  };

  const confirmDeleteDevice = (id: number) => {
    deleteDevice(id);
    setDeleteConfirmation(null);
  };

  const cancelDeleteDevice = () => {
    setDeleteConfirmation(null);
  };

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (
      (e.target as HTMLElement).classList.contains(
        'delete-confirmation-overlay'
      )
    ) {
      setDeleteConfirmation(null);
    }
  };

  const closeQRCodePopup = () => {
    setShowQRCodePopup(false);
    setQrCodeUrl(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Device Management</h2>
      <ul className="list-disc pl-5 mb-4">
        {devices.map((device) => (
          <li
            key={device.id}
            className="flex justify-between items-center mb-4"
          >
            {editingDevice === device.id ? (
              <input
                type="text"
                value={newDeviceName}
                onChange={(e) => setNewDeviceName(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, device.id)}
                className="border p-2 flex-grow mr-2 text-lg h-8"
              />
            ) : (
              <span className="text-lg">{device.name}</span>
            )}
            <div className="flex items-center">
              {editingDevice === device.id ? (
                <>
                  <img
                    src={checkIcon}
                    alt="Save"
                    onClick={() => handleSaveDeviceName(device.id)}
                    className="cursor-pointer mr-3 text-xl h-6 w-6"
                  />
                  <img
                    src={cancelIcon}
                    alt="Cancel"
                    onClick={handleCancelEdit}
                    className="cursor-pointer text-xl h-6 w-6"
                  />
                </>
              ) : (
                <>
                  <FaEdit
                    onClick={() => handleEditDevice(device.id)}
                    className="text-blue-500 cursor-pointer mr-4 text-xl"
                  />
                  <FaTrash
                    onClick={() => handleDeleteDevice(device.id)}
                    className="text-red-500 cursor-pointer text-xl"
                  />
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
      <div
        onClick={handleAddDevice}
        className="bg-gray-200 p-4 text-center cursor-pointer flex items-center justify-center rounded-lg"
      >
        <FaPlus className="text-gray-500 text-xl" />
      </div>
      {deleteConfirmation !== null && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 delete-confirmation-overlay"
          onClick={handleOutsideClick}
        >
          <div className="bg-white p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-4">
              Are you sure you want to delete{' '}
              {devices.find((d) => d.id === deleteConfirmation)?.name}?
            </h3>
            <div className="flex justify-end">
              <button
                onClick={() => confirmDeleteDevice(deleteConfirmation)}
                className="bg-red-500 text-white p-2 rounded mr-2"
              >
                Yes
              </button>
              <button
                onClick={cancelDeleteDevice}
                className="bg-gray-300 text-black p-2 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      {showQRCodePopup && qrCodeUrl && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeQRCodePopup}
        >
          <div className="bg-white p-4 rounded-lg text-center">
            <h3 className="text-lg font-bold mb-4">QR Code</h3>
            <p className="mb-4">보안 카메라로 찍어주세요</p>
            <img src={qrCodeUrl} alt="QR Code" className="mb-4" />
            <button
              onClick={closeQRCodePopup}
              className="bg-gray-300 text-black p-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceManagement;
