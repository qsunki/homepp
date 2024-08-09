// import create from 'zustand';

// interface Device {
//   id: number;
//   name: string;
// }

// interface DeviceStore {
//   devices: Device[];
//   addDevice: (name: string) => void;
//   deleteDevice: (id: number) => void;
//   editDevice: (id: number, name: string) => void;
// }

// export const useDeviceStore = create<DeviceStore>((set) => ({
//   devices: [
//     { id: 1, name: 'Raspberry Pi 1' },
//     { id: 2, name: 'Raspberry Pi 2' },
//     { id: 3, name: 'Raspberry Pi 3' },
//   ],
//   addDevice: (name) =>
//     set((state) => {
//       const newId = state.devices.length
//         ? state.devices[state.devices.length - 1].id + 1
//         : 1;
//       return { devices: [...state.devices, { id: newId, name }] };
//     }),
//   deleteDevice: (id) =>
//     set((state) => ({
//       devices: state.devices.filter((device) => device.id !== id),
//     })),
//   editDevice: (id, name) =>
//     set((state) => ({
//       devices: state.devices.map((device) =>
//         device.id === id ? { ...device, name } : device
//       ),
//     })),
// }));
