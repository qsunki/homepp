import asyncio
from bleak import BleakClient, BleakScanner

# 블루투스 LE 장치의 주소를 저장할 변수
device_address = "A4:75:B9:A0:2B:41"  # 실제 장치 주소로 변경

async def connect_device(address):
    try:
        async with BleakClient(address) as client:
            print(f"Connected to {address}")
            # 최초 연결 시 실행할 기능
            # 예를 들어, 장치 정보 읽기
            device_name_char = "00002A00-0000-1000-8000-00805F9B34FB"
            if device_name_char in client.services.characteristics:
                device_name = await client.read_gatt_char(device_name_char)
                print(f"Device name: {device_name.decode('utf-8')}")
            else:
                print(f"Characteristic {device_name_char} not found.")
    except Exception as e:
        print(f"Failed to connect or read data: {e}")

async def scan_for_device(target_address):
    async def device_found(device, advertisement_data):
        if device.address == target_address:
            print(f"Found target device: {device.address}")
            await connect_device(device.address)
            # 장치를 찾으면 스캔을 중지합니다.
            scanner.stop()
        elif 'A4:75' in device.address:
            print(device.address)

    # BleakScanner 생성자에서 detection_callback 매개변수를 설정합니다.
    scanner = BleakScanner(detection_callback=device_found)
    print("Starting scan...")
    await scanner.start()
    # 30초 동안 스캔 후 종료
    await asyncio.sleep(30)
    print("Stopping scan...")
    await scanner.stop()
    print("Scan stopped.")

if __name__ == "__main__":
    asyncio.run(scan_for_device(device_address))
