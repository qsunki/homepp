import paho.mqtt.client as mqtt
import threading
import time

# 브로커 정보
BROKER = '70.12.114.97'  # 브로커 주소 (PC에서 실행 중인 경우 localhost)
# BROKER = '3.37.120.114'  # 브로커 주소 (PC에서 실행 중인 경우 localhost)

PORT = 1883  # MQTT 기본 포트

# 메시지 수신 콜백 함수
def on_message(client, userdata, message):
    print(f"Received message: {message.payload.decode()} on topic {message.topic}")

# MQTT 클라이언트 생성
client = mqtt.Client()

# 콜백 함수 설정
client.on_message = on_message

# 브로커에 연결
client.connect(BROKER, PORT)

# Subscribe 설정
unique_id = "001"
client.subscribe(f"raspberrypi/{unique_id}")

# 메시지 Publish
client.publish(f"raspberrypi/{unique_id}", "Hello from PC")

# 네트워크 루프를 백그라운드 스레드에서 시작 (비동기)
client.loop_start()

# 터미널 입력을 받아 메시지를 publish하는 함수
def input_loop():
    try:
        global unique_id
        while True:
            message = input("")
            client.publish(f"raspberrypi/{unique_id}", message)
    except KeyboardInterrupt:
        client.loop_stop()
        client.disconnect()
        print("Disconnected from broker")

# 입력 루프를 별도의 스레드에서 실행
input_thread = threading.Thread(target=input_loop)
input_thread.start()

# 메인 스레드에서 무한 루프 실행
try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("Main loop interrupted")

