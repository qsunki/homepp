import asyncio
from bleak import discover, BleakClient

# 블루투스 LE 장치의 주소를 저장할 변수
device_address = "A4:75:B9:A0:2B:41"  # 실제 장치 주소로 변경

async def reconnect_device(address):
    async with BleakClient(address) as client:
        print(f"Reconnected to {address}")
        # 재연결 시 실행할 기능
        # 예를 들어, 장치 정보 읽기
        device_name = await client.read_gatt_char("00002A00-0000-1000-8000-00805F9B34FB")
        print(f"Device name: {device_name.decode('utf-8')}")

async def main():
    known_devices = set()
    
    while True:
        devices = await discover()
        for device in devices:
            if device.address == device_address:
                if device.address not in known_devices:
                    known_devices.add(device.address)
                    print(f"Device {device.address} is nearby")
                    await reconnect_device(device_address)
        await asyncio.sleep(10)  # 10초마다 검색

if __name__ == "__main__":
    asyncio.run(main())
