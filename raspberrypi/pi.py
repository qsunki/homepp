import json
import threading
import time
import paho.mqtt.client as mqtt
from datetime import datetime
import cv2
import schedule
from pyzbar import pyzbar
import requests
from requests_toolbelt.multipart.encoder import MultipartEncoder
import bluetooth
from collections import deque
from flask import Flask, render_template
import os
import subprocess
from flask_socketio import SocketIO, emit
import board
import adafruit_dht
import RPi.GPIO as GPIO

BROKER = 'i11a605.p.ssafy.io'
PORT = 3000
fourcc = cv2.VideoWriter_fourcc(*'avc1')
face_cascade = cv2.CascadeClassifier('haarcascade/haarcascade_frontalface_default.xml')
dht_device = adafruit_dht.DHT11(board.D2, use_pulseio=False)

global cnt_record, max_cnt_record, on_record, is_detected, is_record, is_capture, is_stream, is_system_on, is_first, blt_address, cam_id, stream_id, is_req_temp_hmdt, is_nearby, temp, hmdt, is_sound, is_fire, cap, nowDatetime
is_fire = is_sound = is_req_temp_hmdt = is_system_on = is_stream = on_record = is_record = is_detected = is_capture = False
is_first = True
temp = hmdt = cnt_record = 0
is_nearby = deque(maxlen=6)
stream_id = cap = nowDatetime = None
cam_id = 63
blt_address = 'A4:75:B9:A0:2B:41'
max_cnt_record = 90

def on_message(client, userdata, message):
    global is_stream, cam_id, stream_id, is_system_on, cap
    topic = message.topic
    sub_message = message.payload.decode()
    print(f"Received message: {sub_message} on topic {topic}")

    try:
        data = json.loads(sub_message)
    except Exception as e:
        print(f"Error parsing message: {e}")
        return

    try:
        if topic == f'cams/{cam_id}/control' and not is_first:
            if data.get('command') == 'start':
                data = json.dumps({'camId': cam_id, 'status': 'RECORDING'})
                is_system_on = True
                print('system start')
                client.publish('server/status', data)
                print('pub sys start')
            elif data.get('command') == 'end' and not is_first:
                data = json.dumps({'camId': cam_id, 'status': 'OFFLINE'})
                is_system_on = False
                print('system end')
                client.publish('server/status', data)
                print('pub sys end')

        if topic == f'cams/{cam_id}/stream' and not is_first and is_system_on:
            stream_id = data.get('key')
            command = data.get('command')
            if command == 'start':
                print('stream start')
                is_stream = True
                cap.release()
                socketio.emit('stream_id_update', {'stream_id': stream_id})
            elif command == 'end' and not is_first and is_system_on:
                print('stream end')
                is_stream = False
                socketio.emit('stop_stream')
                time.sleep(1)
                cap.open(0)

    except Exception as e:
        print(f"Error in topic of {topic} : {e}")

def mqtt_setup():
    global client, cam_id
    client = mqtt.Client()
    client.on_message = on_message
    client.connect(BROKER, PORT)
    client.subscribe(f"cams/{cam_id}/control")
    client.subscribe(f"cams/{cam_id}/stream")
    client.loop_start()

def decode_qr(frame):
    global blt_address, cam_id, is_first
    decoded_objects = pyzbar.decode(frame)
    if decoded_objects:
        for obj in decoded_objects:
            text = obj.data.decode("utf-8")
            data = json.loads(text)
            email = data.get('email')
            blt_address = data.get('blt_address')
            print(blt_address)
            # API로 이메일 전송 및 응답 수신 (추후 수정)
            if email:
                print(email)
                api_url = "https://i11a605.p.ssafy.io/api/v1/cams"
                payload = {"email": email}
                response = requests.post(api_url, json=payload)
                print('requests.post for email')
                if response.status_code == 200:
                    response_data = response.json()
                    print(response_data)
                    cam_id = response_data.get('camId')
                    print(f'response cam_id : {cam_id}')
                    is_first = False
                    mqtt_setup()
                else:
                    print(f"Failed to get camId: {response.status_code}, {response.text}")

def interval_task():
    global is_capture, is_first, is_req_temp_hmdt, is_system_on
    if is_first is False:
        is_req_temp_hmdt = True
        if is_system_on:
            is_capture = True

def upload_tmp_hmdt(date_time):
    global cam_id, is_system_on, is_req_temp_hmdt, temp, hmdt, is_first
    if is_first is False:
        try:
            temp = dht_device.temperature
            hmdt = dht_device.humidity
        except RuntimeError as error:
            print(f"Error reading sensor: {error}")
        except Exception as e:
            print(f"Unexpected error: {e}")

        if is_system_on:
            status = "RECODING"
        else:
            status = "OFFLINE"
        data = {
            "camId": cam_id,
            "recordedAt": date_time,
            "temperature": temp,
            "humidity": hmdt,
            "status": status
        }
        json_data = json.dumps(data)
        client.publish('server/envInfo', json_data)
        is_req_temp_hmdt = False
        print(json_data)

def video_upload(file, json_data):
    global cam_id
    api_url = f'https://i11a605.p.ssafy.io/api/v1/cams/{cam_id}/videos'
    try:
        encoder = MultipartEncoder(
            fields={
                'file': (file, open(file, 'rb'), 'video/mp4'),
                'timeInfo': (None, json_data, 'application/json')
            }
        )
        print(encoder.content_type)
        response = requests.post(
            api_url,
            data=encoder,
            headers={'Content-Type': encoder.content_type}
        )
        print(response.status_code)
        print(response)
        os.remove(file)
    except Exception as e:
        print(f'request error : {e}')

def image_upload(file, data_time):
    global cam_id
    api_url = f'https://i11a605.p.ssafy.io/api/v1/cams/{cam_id}/thumbnail'
    try:
        encoder = MultipartEncoder(
            fields={
                'file': (file, open(file, 'rb'), 'image')
            }
        )
        response = requests.post(
            api_url,
            data=encoder,
            headers={'Content-Type': encoder.content_type}
        )
        print(response.status_code)
        print(response)
        os.remove(file)
    except Exception as e:
        print(f'request error : {e}')

def is_device_nearby(device_address):
    nearby_devices = bluetooth.discover_devices()
    for addr in nearby_devices:
        if addr == device_address:
            return True
    return False

def scan_for_devices():
    global blt_address, is_nearby, is_stream, is_system_on, on_record, is_detected, nowDatetime, temp, hmdt
    while True:
        time.sleep(30)
        if is_system_on and is_stream is False and on_record is False and is_detected is False:
            print('blt scan start')
            if is_device_nearby(blt_address):
                print(f"Device {blt_address} is nearby.")
                is_system_on = False
                data = json.dumps({'camId': cam_id, 'status': 'OFFLINE'})
                client.publish('server/status', data)
                data = {
                    "camId": cam_id,
                    "recordedAt": nowDatetime,
                    "temperature": temp,
                    "humidity": hmdt,
                    "status": 'OFFLINE'
                }
                json_data = json.dumps(data)
                client.publish('server/envInfo', json_data)
                print(f'pub {data}')
            else:
                print(f'Device {blt_address} is not nearby.')

def sensor():
    global is_system_on, is_sound, is_fire
    SOUND_PIN = 17
    FLAME_SENSOR_PIN = 4
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(SOUND_PIN, GPIO.IN)
    GPIO.setup(FLAME_SENSOR_PIN, GPIO.IN)
    sounds = deque(maxlen=10)
    while True:
        time.sleep(0.05)
        try:
            if is_system_on:
                if GPIO.input(FLAME_SENSOR_PIN):
                    is_fire = True
                    # print("불꽃 감지됨!")
                soundlevel = GPIO.input(SOUND_PIN)
                sounds.append(soundlevel)
                # if soundlevel and 1 not in sounds:
                #     print('큰소리 감지!')
                if soundlevel:
                    is_sound = True
        except Exception as e:
            print('error message :', e)

app = Flask(__name__)
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('cam_offer_test.html')

def run_server():
    app.run(host='0.0.0.0', port=8000, debug=False)

schedule.every(1).minutes.do(interval_task)
# schedule.every(5).seconds.do(interval_task)
# schedule.every(2).seconds.do(interval_task)

if __name__ == '__main__':
    global client
    server_thread = threading.Thread(target=run_server)
    server_thread.daemon = True  # 메인 스레드 종료 시 백그라운드 스레드도 종료됩니다.
    server_thread.start()
    scan_thread = threading.Thread(target=scan_for_devices)
    scan_thread.daemon = True
    scan_thread.start()
    scan_thread = threading.Thread(target=sensor)
    scan_thread.daemon = True
    scan_thread.start()
    
    cap = cv2.VideoCapture(0)
    # 캠 등록부터 하려면 아래 두 줄을 주석처리 할 것
    # 원활한 시연을 위해 존재하는 코드입니다.
    is_first = False
    mqtt_setup()

    env = os.environ.copy()
    env['DISPLAY'] = ':0'
    subprocess.Popen(['xdg-open', 'http://127.0.0.1:8000'], env=env)

    while True:
        try:
            if is_first:
                if cap.isOpened():
                    ret, frame = cap.read()
                    decode_qr(frame)
            else:
                schedule.run_pending()
                now = datetime.now()
                nowDatetime = now.strftime('%Y-%m-%dT%H:%M:%SZ')
                nowDatetime_path = now.strftime('%Y-%m-%d %H_%M_%S')

                # 온습도 센싱
                if is_req_temp_hmdt:
                    upload_tmp_hmdt(nowDatetime)

                if cap.isOpened():
                    ret, frame = cap.read()
                
                    # 1-1. 외출 했을 때 (동작)
                    if is_system_on:
                        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                        faces = face_cascade.detectMultiScale(gray, scaleFactor= 1.5, minNeighbors=3, minSize=(20,20))
                    
                        # 1-1-1. 특정 대상이 감지됐을 때
                        if len(faces) or is_sound or is_fire:
                            if len(faces):
                                event = 'INVASION'
                            if is_sound:
                                event = 'SOUND'
                                is_sound = False
                            if is_fire:
                                event = 'FIRE'
                                is_fire = False
                            is_detected = True
                            if on_record == False:  # 현재 녹화상태가 아니면
                                print(f'{event} 감지')
                                detect_file_name = f'detected_{nowDatetime_path}.mp4'
                                detected_video = cv2.VideoWriter(detect_file_name, fourcc, 15, (frame.shape[1], frame.shape[0]))
                                print(nowDatetime, '감지 시작')
                                detected_data = {
                                    "camId": cam_id,
                                    "occurredAt": nowDatetime,
                                    "type": event
                                }
                                json_data = json.dumps(detected_data)
                                client.publish('server/event', json_data)
                                print(f'pub {json_data}')
                                record_data = {
                                    "startTime": nowDatetime,
                                    "endTime": nowDatetime
                                }
                            cnt_record = max_cnt_record
                        if is_detected == True :     # 감지 상태가 True 이면
                            detected_video.write(frame)     # 현재 프레임 저장
                            cnt_record -= 1         # 녹화시간 1 감소
                            on_record = True

                            if cnt_record == 0:
                                is_detected = False
                                on_record = False
                                detected_video.release()    # 녹화한 영상을 파일로 씀
                                print(nowDatetime, '감지 종료')
                                record_data['endTime'] = nowDatetime
                                json_data = json.dumps(record_data)
                                video_upload(detect_file_name, json_data)

                        # 1-1-2. 썸네일 캡쳐
                        if is_capture:
                            is_capture = False
                            thumbnail_file_name = f'thumbnail_{nowDatetime_path}.png'
                            cv2.imwrite(thumbnail_file_name, frame)  # 파일이름(한글안됨), 이미지
                            print(nowDatetime, 'thumbnail captured')
                            image_upload(thumbnail_file_name, nowDatetime)

                    # 1-2. 귀가 했을 때 (대기)
                    else:
                        time.sleep(0.1)
                else:
                    time.sleep(0.1)
        except Exception as e:
            print(e)