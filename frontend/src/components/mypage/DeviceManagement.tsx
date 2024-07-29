import React, { useState } from 'react';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import { useDeviceStore } from '../../stores/useDeviceStore';

const DeviceManagement: React.FC = () => {
  const devices = useDeviceStore((state) => state.devices);
  const addDevice = useDeviceStore((state) => state.addDevice);
  const deleteDevice = useDeviceStore((state) => state.deleteDevice);
  const editDevice = useDeviceStore((state) => state.editDevice);

  const [editingDevice, setEditingDevice] = useState<number | null>(null);
  const [newDeviceName, setNewDeviceName] = useState<string>('');

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

  const handleAddDevice = () => {
    addDevice('New Device');
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: number
  ) => {
    if (e.key === 'Enter') {
      handleSaveDeviceName(id);
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
                className="border p-2 flex-grow mr-2 text-lg"
              />
            ) : (
              <span className="text-lg">{device.name}</span>
            )}
            <div className="flex items-center">
              {editingDevice === device.id ? (
                <button
                  onClick={() => handleSaveDeviceName(device.id)}
                  className="bg-green-500 text-white p-2 rounded mr-2 text-lg"
                >
                  Save
                </button>
              ) : (
                <>
                  <FaEdit
                    onClick={() => handleEditDevice(device.id)}
                    className="text-blue-500 cursor-pointer mr-4 text-xl"
                  />
                  <FaTrash
                    onClick={() => deleteDevice(device.id)}
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
    </div>
  );
};

export default DeviceManagement;
