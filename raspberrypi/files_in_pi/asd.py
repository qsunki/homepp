import asyncio
import websockets
import stomper
from aiortc import RTCPeerConnection, RTCSessionDescription, VideoStreamTrack, RTCIceCandidate, RTCIceServer, RTCConfiguration, MediaStreamTrack
from aiortc.contrib.media import MediaPlayer
import json
import threading
import time
import paho.mqtt.client as mqtt
from PIL import ImageDraw, Image
from datetime import datetime
import cv2
import numpy as np
import schedule
from pyzbar import pyzbar
import requests
from av import VideoFrame

# Global variables
BROKER = 'i11a605.p.ssafy.io'
PORT = 3000

global player
player = MediaPlayer('/dev/video0')
fourcc = cv2.VideoWriter_fourcc(*'XVID')
face_cascade = cv2.CascadeClassifier('haarcascade/haarcascade_frontalface_default.xml')

global cnt_record, max_cnt_record, on_record, is_detected, is_record, start_record, is_capture, is_stream, is_system_on, is_first, blt_address, cam_id, stream_id
stream_id = None
cam_id = 1
blt_address = None
is_first = True
is_system_on = False
is_stream = False
on_record = False
is_record = False
is_detected = False
is_capture = False
start_record = False
cnt_record = 0
max_cnt_record = 90

class VideoTransformTrack(MediaStreamTrack):

    kind = "video"

    def __init__(self, track, transform):
        super().__init__()  # don't forget this!
        self.track = track
        self.transform = transform

    async def recv(self):
        frame = await self.track.recv()

        if self.transform == "cartoon":
            img = frame.to_ndarray(format="bgr24")

            # prepare color
            img_color = cv2.pyrDown(cv2.pyrDown(img))
            for _ in range(6):
                img_color = cv2.bilateralFilter(img_color, 9, 9, 7)
            img_color = cv2.pyrUp(cv2.pyrUp(img_color))

            # prepare edges
            img_edges = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
            img_edges = cv2.adaptiveThreshold(
                cv2.medianBlur(img_edges, 7),
                255,
                cv2.ADAPTIVE_THRESH_MEAN_C,
                cv2.THRESH_BINARY,
                9,
                2,
            )
            img_edges = cv2.cvtColor(img_edges, cv2.COLOR_GRAY2RGB)

            # combine color and edges
            img = cv2.bitwise_and(img_color, img_edges)

            # rebuild a VideoFrame, preserving timing information
            new_frame = VideoFrame.from_ndarray(img, format="bgr24")
            new_frame.pts = frame.pts
            new_frame.time_base = frame.time_base
            return new_frame
        elif self.transform == "edges":
            # perform edge detection
            img = frame.to_ndarray(format="bgr24")
            img = cv2.cvtColor(cv2.Canny(img, 100, 200), cv2.COLOR_GRAY2BGR)

            # rebuild a VideoFrame, preserving timing information
            new_frame = VideoFrame.from_ndarray(img, format="bgr24")
            new_frame.pts = frame.pts
            new_frame.time_base = frame.time_base
            return new_frame
        elif self.transform == "rotate":
            # rotate image
            img = frame.to_ndarray(format="bgr24")
            rows, cols, _ = img.shape
            M = cv2.getRotationMatrix2D((cols / 2, rows / 2), frame.time * 45, 1)
            img = cv2.warpAffine(img, M, (cols, rows))

            # rebuild a VideoFrame, preserving timing information
            new_frame = VideoFrame.from_ndarray(img, format="bgr24")
            new_frame.pts = frame.pts
            new_frame.time_base = frame.time_base
            return new_frame
        else:
            return frame

def on_message(client, userdata, message):
    global is_stream, start_record, cam_id, stream_id
    print(f"Received message: {message.payload.decode()} on topic {message.topic}")

    if message.topic == f'cams/{cam_id}/stream':
        try:
            data = json.loads(message.payload.decode())
            print(data)
            stream_id = data.get('key')
            is_stream = True
            web_rtc_threading = threading.Thread(target=web_rtc_thread)
            web_rtc_threading.start()
        except Exception as e:
            print(f"Error parsing message: {e}")

    if message.topic == f'cams/{cam_id}/video':
        try:
            data = json.loads(message.payload.decode())
            videoId = data['videoId']
            command = data['command']
            print(data)
            if command == 'start' and not start_record:
                start_record = True
            elif command == 'end' and start_record:
                start_record = False
        except Exception as e:
            print(f"Error parsing message: {e}")

def mqtt_setup():
    global client, cam_id
    client = mqtt.Client()
    client.on_message = on_message
    client.connect(BROKER, PORT)
    client.subscribe(f"cams/{cam_id}/stream")
    client.subscribe(f"cams/{cam_id}/video")
    client.publish(f"server/event", "Hello from RaspberryPi")
    client.loop_start()

def web_rtc_thread():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(connect())

pc = RTCPeerConnection()

async def create_answer(signal, websocket):
    global player
    print('call create_answer')
    offer_sdp = RTCSessionDescription(sdp=signal['data']['sdp'], type='offer')
    await pc.setRemoteDescription(offer_sdp)
    print('setRemoteDescription')

    video_track = player.video
    if video_track:
        pc.addTrack(video_track)

    print('addTrack')

    answer = await pc.createAnswer()
    print('createAnswer')
    await pc.setLocalDescription(answer)
    print('setLocalDescription')

    answer_sdp = pc.localDescription.sdp
    print('answer_sdp')
    response = {
        'type': 'answer',
        'data': {
            'sdp': answer_sdp,
            'type': 'answer'
        }
    }
    await websocket.send(stomper.send("/pub/cam/123", json.dumps(response)))

async def add_candidate(signal):
    print(f"Adding candidate: {signal['data']}")
    candidate = RTCIceCandidate(
        ip = signal['data']['candidate'].split(' ')[4],
        port = signal['data']['candidate'].split(' ')[5],
        protocol = signal['data']['candidate'].split(' ')[7],
        priority = signal['data']['candidate'].split(' ')[3],
        foundation = signal['data']['candidate'].split(' ')[0],
        component = signal['data']['candidate'].split(' ')[1],
        type = signal['data']['candidate'].split(' ')[7],
        sdpMid=signal['data']['sdpMid'],
        sdpMLineIndex=signal['data']['sdpMLineIndex'],
    )
    await pc.addIceCandidate(candidate)
    print('<end addIceCandidate>')

async def connect():
    global stream_id
    ws_url = "ws://i11a605.p.ssafy.io:8081/ws/websocket"
    try:
        global websocket
        async with websockets.connect(ws_url) as websocket:
            print(f"Connected to {ws_url}")

            connect_frame = "CONNECT\naccept-version:1.1,1.2\nhost:i11a605.p.ssafy.io\n\n\x00"
            await websocket.send(connect_frame)

            sub_offer = stomper.subscribe(f'/sub/cam/{stream_id}', idx=stream_id)
            await websocket.send(sub_offer)

            while True:
                try:
                    print("Waiting for a message...")
                    message = await websocket.recv()
                    if message[:7] == 'MESSAGE':
                        for i in range(len(message)):
                            if message[i] == '{':
                                idx = i
                                break
                        signal = json.loads(message[idx:-1])
                        print(f'<Received signal type> : {signal["type"]}')
                        if signal['type'] == 'offer':
                            await create_answer(signal, websocket)
                        elif signal['type'] == 'candidate':
                            await add_candidate(signal)
                except websockets.ConnectionClosedError:
                    print("Connection closed with error.")
                    break
                except Exception as e:
                    print(f"An unexpected error occurred: {e}")
                    break
    except Exception as e:
        print(f"Failed to connect or communicate: {e}")

def decode_qr(frame):
    global blt_address, cam_id
    decoded_objects = pyzbar.decode(frame)
    if decoded_objects:
        for obj in decoded_objects:
            text = obj.data.decode("utf-8")
            data = json.loads(text)
            email = data.get('email')
            blt_address = data.get('blt_address')
            # API로 이메일 전송 및 응답 수신 (추후 수정)
            if email:
                # api_url = "https://i11a605.p.ssafy.io/api/v1/cams"
                # payload = {"email": email}
                # response = requests.post(api_url, json=payload)

                # if response.status_code == 200:
                #     response_data = response.json()
                #     cam_id = response_data.get('camId')
                # else:
                #     print(f"Failed to get camId: {response.status_code}, {response.text}")
                pass
        print(email)
        print(blt_address)

        return False
    return True

async def gen_frame(player):
    frame = await player.video.recv()
    img = frame.to_ndarray(format="bgr24")
    return img

async def main():
    global cnt_record, max_cnt_record, on_record, is_detected, is_record, start_record, is_capture, is_stream, is_system_on, is_first, blt_address, cam_id, stream_id
    while True:
        now = datetime.now()
        nowDatetime = now.strftime('%Y-%m-%dT%H:%M:%SZ')
        nowDatetime_path = now.strftime('%Y-%m-%d %H_%M_%S')
        frame = await gen_frame(player)
        if frame is None:
            continue

        # schedule.run_pending()
        if is_first:
            is_first = decode_qr(frame)
        else:
            if is_system_on:
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                faces = face_cascade.detectMultiScale(gray, scaleFactor=1.5, minNeighbors=3, minSize=(20,20))

                if len(faces):
                    is_detected = True
                    if on_record == False:
                        detect_file_name = f'detected_{nowDatetime_path}.avi'
                        video0 = cv2.VideoWriter(detect_file_name, fourcc, 15, (frame.shape[1], frame.shape[0]))
                        print(nowDatetime, '감지 시작')
                        data = {
                            "camId": cam_id,
                            "occurredAt": nowDatetime,
                            "type": "invasion"
                        }
                        json_data = json.dumps(data)
                        client.publish(f"cams/{cam_id}/stream", json_data)
                    cnt_record = max_cnt_record
                if is_detected == True:
                    video0.write(frame)
                    cnt_record -= 1
                    on_record = True

                    if cnt_record == 0:
                        is_detected = False
                        on_record = False
                        video0.release()
                        print(nowDatetime, '감지 종료')
                        # file_upload(detect_file_name)

                if start_record == True and is_record == False:
                    is_record = True
                    start_record = False
                    record_file_name = f'detected_{nowDatetime_path}.avi'
                    video1 = cv2.VideoWriter(record_file_name, fourcc, 15, (frame.shape[1], frame.shape[0]))
                    print(nowDatetime, '녹화 시작')
                elif start_record and is_record == True:
                    is_record = False
                    start_record = False
                    video1.release()
                    print(nowDatetime, '녹화 종료')
                    # file_upload(record_file_name)
                if is_record == True:
                    video1.write(frame)
                
                if is_capture:
                    is_capture = False
                    thumbnail_file_name = f'thumbnail_{nowDatetime_path}.png'
                    cv2.imwrite(thumbnail_file_name, frame)
                    # file_upload(thumbnail_file_name)
                    print(nowDatetime, 'thumbnail captured')

                if is_stream:
                    ref, buffer = cv2.imencode('.jpg', frame)
                    frame = buffer.tobytes()
                    # yield (b'--frame\r\n'
                    #     b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

if __name__ == '__main__':
    global client
    mqtt_setup()

    asyncio.run(main())
    print('async main end')
