from PIL import ImageDraw, Image
from datetime import datetime
import cv2
import numpy as np
import schedule
import paho.mqtt.client as mqtt
import threading
import json
import requests


# 라즈베리파이 내부 IP (추후 환경변수로 숨길 것)
ip = "192.168.137.62"
port = "8080"

# 캠을 capture class에 저장
capture = cv2.VideoCapture(0)
capture.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
capture.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
# 녹화파일을 저장할 코덱 설정
fourcc = cv2.VideoWriter_fourcc(*'XVID')

# 촬영 상태에 대한 여러가지 전역 변수들 선언
global push_btn, cnt_record, max_cnt_record, on_record, is_detected, is_record, start_record, is_capture
push_btn = False
on_record = False
is_record = False
is_detected = False
is_capture = False
start_record = False
cnt_record = 0       # 영상 녹화 시간 관련 변수
max_cnt_record = 90  # 최소 촬영시간

# 특정 대상을 인식하는 xml 사용
face_cascade = cv2.CascadeClassifier('haarcascade/haarcascade_frontalface_default.xml')


def thumbnail_capture():         # 1분마다 썸네일을 캡쳐하도록 하는 함수
    global is_capture       # is_capture를 전역변수로 불러옴
    is_capture = True       # is_capture를 참으로 만들어줌

def file_upload(file):
    file = open(file, 'rb')
    upload = {'file': file}
    # res = requests.post('{}/api/v1/cams/{camId}/videos', files = upload)


BROKER = '70.12.114.97'  # 브로커 주소 (PC랜선)
PORT = 1883  # MQTT 기본 포트
camId = '001'

# 메시지 수신 콜백 함수
def on_message(client, userdata, message):
    print(f"Received message: {message.payload.decode()} on topic {message.topic}")
    global camId
    # 스티리밍 요청 오면
    if message.topic == f'cams/{camId}/stream':
        try:
            global push_btn
            data = json.loads(message.payload.decode())
            print(data)
            gen_frames()
        except Exception as e:
            print(f"Error parsing message: {e}")
    # 녹화 요청 오면
    if message.topic == f'cams/{camId}/video':
        try:
            global start_record
            # 수신한 메시지를 JSON 형식(dict)으로 디코딩
            data = json.loads(message.payload.decode())
            videoId = data['videoId']
            command = data['command']
            print(data)
            if command == 'start' and start_record == False:
                start_record = True
            elif command == 'end' and start_record == True:
                start_record = False
        except Exception as e:
            print(f"Error parsing message: {e}")

client = mqtt.Client()      # MQTT 클라이언트 생성
client.on_message = on_message  # 콜백 함수 설정
client.connect(BROKER, PORT)    # 브로커에 연결

client.subscribe(f"cams/{camId}/stream")
client.subscribe(f"cams/{camId}/video")
client.publish(f"server/event", "Hello from RaspberryPi")
client.loop_start()     # 네트워크 루프를 백그라운드 스레드에서 시작 (비동기)


schedule.every(1).minutes.do(thumbnail_capture)

def gen_frames():
    global push_btn, mode_btn, cnt_record, max_cnt_record, on_record, is_detected, is_record, video0, video1, start_record, is_capture, detect_file_name, record_file_name
    while True:
        # 현재시각
        now = datetime.now()
        # yyyy-mm-ddThh:mm:ssZ
        nowDatetime = now.strftime('%Y-%m-%dT%H:%M:%SZ')
        nowDatetime_path = now.strftime('%Y-%m-%d %H_%M_%S')
        # 캠으로부터 현재 프레임을 받아옴
        ref, frame = capture.read()
        # 프레임이 잘 받아지는지 체크
        if not ref:
            break
        else:
            # 버튼을 눌렀을때 (화면 끄기 버튼)
            # if push_btn:
            #     # frame을 검게 바꿈 (off)
            #     frame = np.zeros([480, 640, 3], dtype="uint8")
            #     frame = Image.fromarray(frame)
            #     draw = ImageDraw.Draw(frame)
            #     draw.text(xy=(10, 15), text=nowDatetime, fill=(255, 255, 255))
            #     draw.text(xy=(320, 240),  text="OFF", fill=(255, 255, 255))
            #     frame = np.array(frame)
            # else:
            # frame을 흑백으로 바꿔 gray에 저장
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            # gray에서 특정 대상을 찾음
            faces = face_cascade.detectMultiScale(gray, scaleFactor= 1.5, minNeighbors=3, minSize=(20,20))

            frame = Image.fromarray(frame)
            draw = ImageDraw.Draw(frame)
            draw.text(xy=(10, 15), text=nowDatetime, fill=(255, 255, 255))
            frame = np.array(frame)

            schedule.run_pending()

            # 특정 대상이 감지됐을 때
            if len(faces):
                is_detected = True
                if on_record == False:  # 현재 녹화상태가 아니면
                    # 영상 파일을 쓸 준비 (파일명, 인코더, fps, 영상크기)
                    detect_file_name = f'detected_{nowDatetime_path}.avi'
                    video0 = cv2.VideoWriter(detect_file_name, fourcc, 15, (frame.shape[1], frame.shape[0]))
                    print(nowDatetime, '감지 시작')
                    data = {
                        "camId": camId,
                        "occurredAt": nowDatetime,
                        "type": "invasion"
                    }
                    json_data = json.dumps(data)
                    client.publish(f"cams/{camId}/stream", json_data)
                cnt_record = max_cnt_record

            if is_detected == True :     # 감지 상태가 True 이면
                video0.write(frame)     # 현재 프레임 저장
                cnt_record -= 1         # 녹화시간 1 감소
                on_record = True        # 녹화중 여부를 참으로

                if cnt_record == 0:     # 녹화시간이 다 되면
                    is_detected = False # 녹화관련 변수들을 거짓으로
                    on_record = False
                    video0.release()    # 녹화한 영상을 파일로 씀
                    print(nowDatetime, '감지 종료')
                    file_upload(detect_file_name)

            # 녹화버튼 눌렀을 때
            if start_record == True and is_record == False:
                is_record = True            # 녹화상태로 만들어줌
                start_record = False        # start_record는 거짓으로
                # 영상 파일을 쓸 준비 (파일명, 인코더, fps, 영상크기)
                record_file_name = f'detected_{nowDatetime_path}.avi'
                video1 = cv2.VideoWriter(record_file_name, fourcc, 15, (frame.shape[1], frame.shape[0]))
                print(nowDatetime, '녹화 시작')
            elif start_record and is_record == True: # 녹화중인 상태에서 다시 녹화버튼을 누르면
                is_record = False       # 녹화상태를 꺼줌
                start_record = False
                video1.release()         # 녹화 종료
                print(nowDatetime, '녹화 종료')
                file_upload(record_file_name)
            if is_record == True:       # 현재 녹화상태이면            
                # 비디오 객체에 현재 프레임 저장
                video1.write(frame)
            # 썸네일 캡쳐
            if is_capture:
                is_capture = False
                thumbnail_file_name = f'thumbnail_{nowDatetime_path}.png'
                cv2.imwrite(thumbnail_file_name, frame)  # 파일이름(한글안됨), 이미지
                file_upload(thumbnail_file_name)
                print(nowDatetime, 'thumbnail captured')

        # 위 과정으로 정재된 frame을 버퍼로 저장
        ref, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
        # 그림파일들을 쌓아두고 호출을 기다림 -> 스트리밍
        yield (b'--frame\r\n'
            b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')