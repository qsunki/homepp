import React, { useState } from 'react';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import { useDeviceStore } from '../../stores/useDeviceStore';
import { useUserStore } from '../../stores/useUserStore';
import Loader from './Loader'; // Loader 컴포넌트 임포트
import checkIcon from '../../assets/mypage/check.png';
import cancelIcon from '../../assets/mypage/cancel.png';

interface FoundDevice {
  name: string;
  rssi?: number;
  device: BluetoothDevice;
}

const DeviceManagement: React.FC = () => {
  const devices = useDeviceStore((state) => state.devices);
  const addDevice = useDeviceStore((state) => state.addDevice);
  const deleteDevice = useDeviceStore((state) => state.deleteDevice);
  const editDevice = useDeviceStore((state) => state.editDevice);
  const userEmail = useUserStore((state) => state.email); // userEmail 가져오기

  const [editingDevice, setEditingDevice] = useState<number | null>(null);
  const [newDeviceName, setNewDeviceName] = useState<string>('');
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [foundDevices, setFoundDevices] = useState<FoundDevice[]>([]);
  const [showDeviceSelection, setShowDeviceSelection] =
    useState<boolean>(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(
    null
  );

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
    setShowLoader(true);
    try {
      const nav = navigator as Navigator & {
        bluetooth: {
          requestDevice: (options: {
            filters?: { services: string[] }[];
            optionalServices?: string[];
            acceptAllDevices?: boolean;
          }) => Promise<BluetoothDevice>;
        };
      };

      if (!nav.bluetooth) {
        throw new Error('Bluetooth is not supported by your browser.');
      }

      console.log('Requesting Bluetooth device...');
      const device = await nav.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service'], // 필요한 서비스 UUID 추가
      });

      console.log('Found device:', device.name);
      setFoundDevices((prevDevices) => [
        ...prevDevices,
        {
          name: device.name || 'Unknown Device',
          device,
        },
      ]);
      setShowLoader(false);
      setShowDeviceSelection(true);
    } catch (error) {
      console.error('Error during Bluetooth device search:', error);
      if ((error as DOMException).name === 'NotFoundError') {
        console.log(
          'No devices found. Please ensure your Bluetooth is enabled and try again.'
        );
      } else if ((error as DOMException).name === 'NotAllowedError') {
        console.log('Permission to access Bluetooth devices was denied.');
      } else if ((error as DOMException).name === 'SecurityError') {
        console.log('This page must be served over HTTPS.');
      } else {
        console.error('Unknown error:', error);
      }
      setShowLoader(false);
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

  const handleSelectDevice = async (device: FoundDevice) => {
    console.log('Connecting to device...');
    try {
      const server = device.device.gatt?.connected
        ? device.device.gatt
        : await device.device.gatt?.connect();

      if (server) {
        console.log('Connected to device:', device.name);
        console.log('Device Info:', device.device); // 연결된 기기 정보 출력

        // 기기의 모든 서비스 가져오기
        const services = await server.getPrimaryServices();

        // 예시로 첫 번째 서비스와 첫 번째 특성에 사용자 이메일을 전송
        if (services.length > 0) {
          const firstService = services[0];
          const characteristics = await firstService.getCharacteristics();
          if (characteristics.length > 0) {
            const firstCharacteristic = characteristics[0];
            const encoder = new TextEncoder();
            const emailBuffer = encoder.encode(userEmail);
            await firstCharacteristic.writeValue(emailBuffer);
            console.log('Email sent to device:', userEmail);
          }
        }

        addDevice(device.name);
      }
    } catch (error) {
      console.error('Error connecting to device:', error);
    }
    setShowDeviceSelection(false);
  };

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (
      (e.target as HTMLElement).classList.contains('device-selection-overlay')
    ) {
      setShowDeviceSelection(false);
    }
    if (
      (e.target as HTMLElement).classList.contains(
        'delete-confirmation-overlay'
      )
    ) {
      setDeleteConfirmation(null);
    }
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
      {showLoader && <Loader />}
      {showDeviceSelection && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 device-selection-overlay"
          onClick={handleOutsideClick}
        >
          <div className="bg-white p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-4">Select a device to add</h3>
            <ul>
              {foundDevices
                .sort((a, b) => (b.rssi ?? 0) - (a.rssi ?? 0)) // 신호 세기 순으로 정렬
                .map((foundDevice) => (
                  <li key={foundDevice.device.id} className="mb-2">
                    <button
                      onClick={() => handleSelectDevice(foundDevice)}
                      className="bg-blue-500 text-white p-2 rounded w-full"
                    >
                      {foundDevice.name} (RSSI: {foundDevice.rssi ?? 'N/A'})
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}
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
    </div>
  );
};

export default DeviceManagement;
