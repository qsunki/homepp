import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import { useDeviceStore } from '../../stores/useDeviceStore';
import { useUserStore } from '../../stores/useUserStore';
import Loader from './Loader';
import checkIcon from '../../assets/mypage/check.png';
import cancelIcon from '../../assets/mypage/cancel.png';

interface FoundDevice {
  name: string;
  rssi: number;
  device: BluetoothDevice;
}

interface BluetoothAdvertisingEvent extends Event {
  device: BluetoothDevice;
  uuids: string[];
  manufacturerData: Map<number, DataView>;
  serviceData: Map<string, DataView>;
  rssi: number;
}

const DeviceManagement: React.FC = () => {
  const devices = useDeviceStore((state) => state.devices);
  const addDevice = useDeviceStore((state) => state.addDevice);
  const deleteDevice = useDeviceStore((state) => state.deleteDevice);
  const editDevice = useDeviceStore((state) => state.editDevice);
  const userEmail = useUserStore((state) => state.email);

  const [editingDevice, setEditingDevice] = useState<number | null>(null);
  const [newDeviceName, setNewDeviceName] = useState<string>('');
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [foundDevices, setFoundDevices] = useState<FoundDevice[]>([]);
  const [showDeviceSelection, setShowDeviceSelection] =
    useState<boolean>(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(
    null
  );
  const [noDevicesFound, setNoDevicesFound] = useState<boolean>(false);

  useEffect(() => {
    if (showLoader) {
      startScanning();
    }
  }, [showLoader]);

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

  const startScanning = async () => {
    try {
      const nav = navigator as Navigator & {
        bluetooth: {
          requestLEScan: (options: {
            filters?: { name?: string }[];
          }) => Promise<BluetoothLEScan>;
        };
      };

      if (!nav.bluetooth || !nav.bluetooth.requestLEScan) {
        throw new Error('Bluetooth scanning is not supported by your browser.');
      }

      console.log('Starting Bluetooth LE scan...');
      const scan = await nav.bluetooth.requestLEScan({});

      const handleAdvertisementReceived = (event: Event) => {
        const bluetoothEvent = event as BluetoothAdvertisingEvent;
        const deviceName = bluetoothEvent.device.name ?? '';
        const deviceRssi = bluetoothEvent.rssi ?? 0;

        if (deviceName && deviceRssi !== undefined) {
          console.log(`Found device: ${deviceName}, RSSI: ${deviceRssi}`);
          setFoundDevices((prevDevices) => {
            const existingDeviceIndex = prevDevices.findIndex(
              (d) => d.device.id === bluetoothEvent.device.id
            );
            if (existingDeviceIndex !== -1) {
              prevDevices[existingDeviceIndex] = {
                name: deviceName,
                rssi: deviceRssi,
                device: bluetoothEvent.device,
              };
              return [...prevDevices];
            }
            return [
              ...prevDevices,
              {
                name: deviceName,
                rssi: deviceRssi,
                device: bluetoothEvent.device,
              },
            ];
          });
        }
      };

      navigator.bluetooth.addEventListener(
        'advertisementreceived',
        handleAdvertisementReceived as EventListener
      );

      // 스캔 중지 함수 설정
      const stopScanning = () => {
        console.log('Stopping Bluetooth LE scan...');
        scan.stop();
        navigator.bluetooth.removeEventListener(
          'advertisementreceived',
          handleAdvertisementReceived as EventListener
        );
        setShowLoader(false);
        if (foundDevices.length === 0) {
          setNoDevicesFound(true);
        } else {
          setShowDeviceSelection(true);
        }
      };

      // 일정 시간 후 스캔 중지
      setTimeout(stopScanning, 10000);
    } catch (error) {
      console.error('Error during Bluetooth LE scan:', error);
      setShowLoader(false);
      alert('Bluetooth scanning is not supported by your browser.');
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

  const handleSelectDevice = async (foundDevice: FoundDevice) => {
    const { device, name } = foundDevice;
    console.log('Connecting to device...');
    try {
      const server = await device.gatt?.connect();
      if (server) {
        console.log('Connected to device:', device);
        console.log('Device Info:', device); // 연결된 기기 정보 출력
        // 사용자 이메일 정보를 기기에 전송하는 로직
        const emailService = await server.getPrimaryService(
          'email_service_uuid'
        ); // 실제 서비스 UUID로 변경
        const emailCharacteristic = await emailService.getCharacteristic(
          'email_characteristic_uuid'
        ); // 실제 특성 UUID로 변경
        const encoder = new TextEncoder();
        const emailBuffer = encoder.encode(userEmail);
        await emailCharacteristic.writeValue(emailBuffer);
        console.log('Email sent to device:', userEmail);
        addDevice(name);
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
        onClick={() => setShowLoader(true)}
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
                .filter((device) => device.name) // "알 수 없는 기기" 필터링
                .sort((a, b) => b.rssi - a.rssi) // 신호 세기 순으로 정렬
                .map((foundDevice) => (
                  <li key={foundDevice.device.id} className="mb-2">
                    <button
                      onClick={() => handleSelectDevice(foundDevice)}
                      className="bg-blue-500 text-white p-2 rounded w-full"
                    >
                      {foundDevice.name} (RSSI: {foundDevice.rssi})
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}
      {noDevicesFound && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setNoDevicesFound(false)}
        >
          <div className="bg-white p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-4">No devices found</h3>
            <button
              onClick={() => setNoDevicesFound(false)}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Close
            </button>
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
