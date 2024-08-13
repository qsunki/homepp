import React, { useState, useEffect, useCallback } from 'react';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import QRCode from 'qrcode.react';
import { fetchCams, updateCam, deleteCam } from '../../api';
import { useUserStore } from '../../stores/useUserStore';
import checkIcon from '../../assets/mypage/check.png';
import cancelIcon from '../../assets/mypage/cancel.png';

interface CamData {
  camId: number;
  name: string;
  status?: string;
}

interface DeviceManagementProps {
  disableOutsideClick?: boolean;
}

const DeviceManagement: React.FC<DeviceManagementProps> = ({
  disableOutsideClick = false,
}) => {
  const userEmail = useUserStore((state) => state.email);
  const [devices, setDevices] = useState<CamData[]>([]);
  const [editingDevice, setEditingDevice] = useState<number | null>(null);
  const [newDeviceName, setNewDeviceName] = useState<string>('');
  const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(
    null
  );
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [showQRCodePopup, setShowQRCodePopup] = useState<boolean>(false);
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = useCallback(async () => {
    try {
      const response = await fetchCams();
      setDevices(response.data);
    } catch (error) {
      // console.error('Error loading device list:', error);
    }
  }, []);

  const handleEditDevice = (id: number) => {
    setEditingDevice(id);
    const device = devices.find((device) => device.camId === id);
    setNewDeviceName(device ? device.name : '');
    setNameError(null);
  };

  const handleSaveDeviceName = async (id: number) => {
    if (newDeviceName.trim() === '') {
      setNameError('Device name cannot be empty.');
      return;
    }
    try {
      await updateCam(id, { name: newDeviceName });
      setDevices((prevDevices) =>
        prevDevices.map((device) =>
          device.camId === id ? { ...device, name: newDeviceName } : device
        )
      );
      setEditingDevice(null);
      setNewDeviceName('');
      setNameError(null);
    } catch (error) {
      // console.error('Error updating device name:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingDevice(null);
    setNewDeviceName('');
    setNameError(null);
  };

  const handleAddDevice = () => {
    const macAddress = prompt('Enter MAC Address (format: 00:00:00:00:00:00)');
    if (!macAddress) return;

    if (!validateMacAddress(macAddress)) {
      alert('Invalid MAC Address. Please try again.');
      return;
    }

    generateQRCode(macAddress);
  };

  const validateMacAddress = (mac: string) => {
    const macPattern = /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/;
    return macPattern.test(mac);
  };

  const generateQRCode = (macAddress: string) => {
    const data = {
      email: userEmail,
      blt_address: macAddress,
    };
    setQrCodeData(JSON.stringify(data));
    setShowQRCodePopup(true);
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
      await deleteCam(id);
      setDevices((prevDevices) =>
        prevDevices.filter((device) => device.camId !== id)
      );
      setDeleteConfirmation(null);
    } catch (error) {
      // console.error('Error deleting device:', error);
    }
  };

  const cancelDeleteDevice = () => {
    setDeleteConfirmation(null);
  };

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (
      !disableOutsideClick &&
      (e.target as HTMLElement).classList.contains(
        'delete-confirmation-overlay'
      )
    ) {
      setDeleteConfirmation(null);
    }
  };

  const closeQRCodePopup = () => {
    if (!disableOutsideClick) {
      setShowQRCodePopup(false);
      setQrCodeData(null);
      loadDevices(); // QR 코드 팝업을 닫을 때 기기 목록을 다시 불러옴
    }
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
              <div className="flex flex-col flex-grow mr-2">
                <input
                  type="text"
                  value={newDeviceName}
                  onChange={(e) => setNewDeviceName(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, device.camId)}
                  className="border p-2 text-lg h-8"
                />
                {nameError && (
                  <span className="text-red-500 text-sm">{nameError}</span>
                )}
              </div>
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
      {devices.length === 0 && (
        <p className="text-center text-lg text-gray-500">
          No devices have been registered yet.
          <br />
          Please register your device first.
        </p>
      )}
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
      {showQRCodePopup && qrCodeData && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeQRCodePopup}
        >
          <div className="bg-white p-6 rounded-lg text-center w-80 max-w-full">
            <h3 className="text-lg font-bold mb-4">QR Code</h3>
            <p className="mb-4">Scan with your security camera</p>
            <div className="flex justify-center mb-4">
              <QRCode value={qrCodeData} size={256} />
            </div>
            <button
              onClick={closeQRCodePopup}
              className="bg-gray-300 text-black p-2 rounded mt-4"
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
