import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import QRCode from 'qrcode';
import { fetchCams, updateCam } from '../../api';
import { useUserStore } from '../../stores/useUserStore';
import checkIcon from '../../assets/mypage/check.png';
import cancelIcon from '../../assets/mypage/cancel.png';

interface CamData {
  camId: number;
  name: string;
  status?: string;
}

const DeviceManagement: React.FC = () => {
  const userEmail = useUserStore((state) => state.email);
  const [devices, setDevices] = useState<CamData[]>([]);
  const [editingDevice, setEditingDevice] = useState<number | null>(null);
  const [newDeviceName, setNewDeviceName] = useState<string>('');
  const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(
    null
  );
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [showQRCodePopup, setShowQRCodePopup] = useState<boolean>(false);

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      const response = await fetchCams();
      setDevices(response.data);
    } catch (error) {
      console.error('캠 리스트 불러오기 오류:', error);
    }
  };

  const handleEditDevice = (id: number) => {
    setEditingDevice(id);
    const device = devices.find((device) => device.camId === id);
    setNewDeviceName(device ? device.name : '');
  };

  const handleSaveDeviceName = async (id: number) => {
    if (newDeviceName.trim() === '') return;
    try {
      await updateCam(id, { name: newDeviceName });
      setDevices((prevDevices) =>
        prevDevices.map((device) =>
          device.camId === id ? { ...device, name: newDeviceName } : device
        )
      );
      setEditingDevice(null);
      setNewDeviceName('');
    } catch (error) {
      console.error('캠 이름 변경 오류:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingDevice(null);
    setNewDeviceName('');
  };

  const handleAddDevice = async () => {
    try {
      const qrCodeData = `mailto:${userEmail}`;
      const url = await QRCode.toDataURL(qrCodeData);
      setQrCodeUrl(url);
      setShowQRCodePopup(true);
      await updateCam(0, { name: 'New Cam', status: 'UNREGISTERED' });
      loadDevices();
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

  const confirmDeleteDevice = async (id: number) => {
    try {
      await updateCam(id, { status: 'DELETED' });
      setDevices((prevDevices) =>
        prevDevices.filter((device) => device.camId !== id)
      );
      setDeleteConfirmation(null);
    } catch (error) {
      console.error('캠 삭제 오류:', error);
    }
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
            key={device.camId}
            className="flex justify-between items-center mb-4"
          >
            {editingDevice === device.camId ? (
              <input
                type="text"
                value={newDeviceName}
                onChange={(e) => setNewDeviceName(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, device.camId)}
                className="border p-2 flex-grow mr-2 text-lg h-8"
              />
            ) : (
              <span className="text-lg">{device.name}</span>
            )}
            <div className="flex items-center">
              {editingDevice === device.camId ? (
                <>
                  <img
                    src={checkIcon}
                    alt="Save"
                    onClick={() => handleSaveDeviceName(device.camId)}
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
                    onClick={() => handleEditDevice(device.camId)}
                    className="text-blue-500 cursor-pointer mr-4 text-xl"
                  />
                  <FaTrash
                    onClick={() => handleDeleteDevice(device.camId)}
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
              {devices.find((d) => d.camId === deleteConfirmation)?.name}?
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
