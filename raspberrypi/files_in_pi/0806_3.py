import asyncio
import websockets
import stomper
from aiortc import RTCPeerConnection, RTCSessionDescription, RTCIceCandidate, RTCIceServer, RTCConfiguration, RTCIceGatherer
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
from requests_toolbelt.multipart.encoder import MultipartEncoder
import bluetooth
from collections import deque

BROKER = 'i11a605.p.ssafy.io'
PORT = 3000
global player, configuration, pc
player = None
ice_server = [
    RTCIceServer(
        urls='stun:i11a605.p.ssafy.io',
        username='username',
        credential='password',
    ),
    RTCIceServer(
        urls='turn:i11a605.p.ssafy.io:3478',
        username='username',
        credential='password'
    ),
]
configuration = RTCConfiguration(iceServers=ice_server)
pc = RTCPeerConnection(configuration=configuration)
fourcc = cv2.VideoWriter_fourcc(*'mp4v')
face_cascade = cv2.CascadeClassifier('haarcascade/haarcascade_frontalface_default.xml')

global cnt_record, max_cnt_record, on_record, is_detected, is_record, start_record, is_capture, is_stream, is_system_on, is_first, blt_address, cam_id, stream_id, should_stop, loop, is_req_temp_hmdt, is_nearby
is_nearby = deque(maxlen=6)
is_req_temp_hmdt = False
loop = None
should_stop = False
stream_id = None
cam_id = 1
blt_address = 'A4:75:B9:A0:2B:41'
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

def on_message(client, userdata, message):
    global is_stream, start_record, cam_id, stream_id, should_stop, loop, is_system_on
    topic = message.topic
    sub_message = message.payload.decode()
    print(f"Received message: {sub_message} on topic {topic}")
    try:
        data = json.loads(sub_message)
    except Exception as e:
        print(f"Error parsing message: {e}")

    try:
        if topic == f'cams/{cam_id}/control' and is_first is False:
            if data.get('command') == 'start':
                is_system_on = True
                print('system start')
            elif data.get('command') == 'end':
                is_system_on = False
                print('system end')

        if topic == f'cams/{cam_id}/stream' and is_first is False:
            if loop is not None and loop.is_running():
                loop.close()
                print('loop closed in on_message')
            stream_id = data.get('key')
            is_stream = True
            should_stop = False
            web_rtc_thread()

        # 사용하지 않는 기능 (수동 녹화)
        if topic == f'cams/{cam_id}/video' and is_first is False:
            videoId = data['key']
            command = data['command']
            if command == 'start' and not start_record:
                start_record = True
            elif command == 'end' and start_record:
                start_record = False
    
    except Exception as e:
        print(f"Error in topic of {topic} : {e}")

def mqtt_setup():
    global client, cam_id
    client = mqtt.Client()
    client.on_message = on_message
    client.connect(BROKER, PORT)
    client.subscribe(f"cams/{cam_id}/control")
    client.subscribe(f"cams/{cam_id}/stream")
    client.subscribe(f"cams/{cam_id}/video")
    client.loop_start()

def web_rtc_thread():
    global loop
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        print('loop start')
        loop.run_until_complete(connect())
    except asyncio.CancelledError:
        print("WebRTC thread loop was cancelled.")
    finally:
        loop.close()
        print('loop closed in web_rtc_thread')
        return

async def close_connection():
    global player, pc, websocket, is_stream, cap
    print('call close_connection')
    if pc:
        print('if pc:')
        await pc.close()
        print('await pc.close()')
        pc = None
        print('pc = None')
    if player:
        print('if player:')
        player.video.stop()
        print('player.video.stop()')
        player = None
        print('player = None')
    if websocket:
        print('if websocket:')
        await websocket.close()
        print('await websocket.close()')
        websocket = None
        print('websocket = None')
    if cap.isOpened():
        print('if cap.isOpened():')
        cap.release()
        print('cap.release()')
    cap.open(0)
    print('cap.open(0)')
    is_stream = False
    print("Connection closed")

async def gather_ice_candidates():
    global stream_id, ice_server
    ice_gatherer = RTCIceGatherer(iceServers=ice_server)
    await ice_gatherer.gather()
    candidates = ice_gatherer.getLocalCandidates()
    parameters = ice_gatherer.getLocalParameters()

    ip = {}
    for candidate in candidates:
        print(candidate)
        if ip.get(candidate.ip):
            ip[candidate.ip] += 1
        else:
            ip[candidate.ip] = 0
        dumped_candidate = f'candidate:{candidate.foundation} {candidate.component} {candidate.protocol} {candidate.priority} {candidate.ip} {candidate.port} typ {candidate.type} generation 0 ufrag {parameters.usernameFragment} network-cost 999'
        candidate_message = {
            'type': 'candidate',
            'data': {
                'candidate': dumped_candidate,
                'sdpMid': ip[candidate.ip],
                'sdpMLineIndex': ip[candidate.ip],
                'usernameFragment': parameters.usernameFragment
            }
        }
        await websocket.send(stomper.send(f'/pub/cam/{stream_id}', json.dumps(candidate_message)))
        print(f"Sent candidate: {candidate_message}")

async def create_answer(signal, websocket):
    global player, stream_id, pc, configuration
    print('call create_answer')

    # WebRTC 연결 상태 확인 및 새로 생성
    if not pc or pc.signalingState == "closed":
        print("Creating new RTCPeerConnection")
        pc = RTCPeerConnection(configuration=configuration)
        print('RTCPeerConnection')

        # @pc.on("icecandidate")
        # async def on_icecandidate(event):
        #     global websocket
        #     print('on_icecandidate triggered')
        #     if event.candidate:
        #         candidate_message = {
        #             'type': 'candidate',
        #             'data': {
        #                 'candidate': event.candidate.candidate,
        #                 'sdpMid': event.candidate.sdpMid,
        #                 'sdpMLineIndex': event.candidate.sdpMLineIndex,
        #                 'usernameFragment': event.candidate.usernameFragment
        #             }
        #         }
        #         await websocket.send(stomper.send(f'/pub/cam/{stream_id}', json.dumps(candidate_message)))
        #         print(f"Sent candidate: {candidate_message}")
        #     else:
        #         print('No ICE candidate')
    try:
        offer_sdp = RTCSessionDescription(sdp=signal['data']['sdp'], type='offer')
        print('RTCSessionDescription')
        await pc.setRemoteDescription(offer_sdp)
        print('setRemoteDescription')

        if cap.isOpened():
            print('cap.isOpened = True')
            cap.release()
            print('cap.release()')
        if player:
            print('player:')
            player.video.stop()
            print('player.video.stop()')
            player = None
            print('player = None')

        player = MediaPlayer('/dev/video0')
        print('MediaPlayer')
        video_track = player.video
        print('video_track')
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
        await websocket.send(stomper.send(f'/pub/cam/{stream_id}', json.dumps(response)))
        print('send stomp message of answer response')
        await gather_ice_candidates()
        print('gather ice candidate end')

    except Exception as e:
        print(f"An error occurred during the creation of the answer: {e}")
        # 필요한 경우 추가적인 예외 처리 로직 추가

async def add_candidate(signal):
    global pc
    print(f"Adding candidate: {signal['data']}")
    candidate = signal['data']['candidate'].split(' ')
    add_candidate = RTCIceCandidate(
        foundation = candidate[0].split(':')[1],
        component = candidate[1],
        protocol = candidate[2],
        priority = candidate[3],
        ip = candidate[4],
        port = candidate[5],
        type = candidate[7],
        sdpMid = signal['data'].get('sdpMid'),
        sdpMLineIndex = signal['data'].get('sdpMLineIndex'),
    )
    await pc.addIceCandidate(signal['data'])
    print('<end addIceCandidate>')

async def connect():
    global stream_id, websocket, should_stopm, is_stream
    ws_url = "ws://i11a605.p.ssafy.io:8081/ws/websocket"
    try:
        async with websockets.connect(ws_url) as websocket:
            print(f"Connected to {ws_url}")

            connect_frame = "CONNECT\naccept-version:1.1,1.2\nhost:i11a605.p.ssafy.io\n\n\x00"
            await websocket.send(connect_frame)

            sub_offer = stomper.subscribe(f'/sub/cam/{stream_id}', idx=stream_id)
            await websocket.send(sub_offer)

            while not should_stop:
                try:
                    print("Waiting for a message...")
                    message = await websocket.recv()
                    print('message recieved')
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
                        elif signal['type'] == 'disconnection':
                            # await pc.close()
                            await close_connection()
                            is_stream = False
                            break
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
                else:
                    print(f"Failed to get camId: {response.status_code}, {response.text}")
        print(blt_address)

        return False
    return True

def thumbnail_capture():         # 1분마다 썸네일을 캡쳐하도록 하는 함수
    global is_capture, is_first, is_req_temp_hmdt, is_system_on
    if is_first is False:
        is_req_temp_hmdt = True
        if is_system_on:
            is_capture = True

def upload_tmp_hmdt(date_time):
    global cam_id, is_system_on, is_req_temp_hmdt
    if is_system_on:
        status = "RECODING"
    else:
        status = "OFFLINE"
    data = {
        "camId": cam_id,
        "recordedAt": date_time,
        "temperature": 28.3,
        "humidity": 33.3,
        "status": status
    }
    json_data = json.dumps(data)
    client.publish('server/envInfo', json_data)
    is_req_temp_hmdt = False

def video_upload(file, json_data):
    global cam_id
    api_url = f'https://i11a605.p.ssafy.io/api/v1/cams/{cam_id}/videos'
    try:
    #     files = {
    #         'file': open(file, 'rb'),
    #         'json_data': (None, json.dumps(json_data), 'app/video')
    #     }
    #     headers = {'Content-Type': 'multipart/form-data'}
    #     response = requests.post(api_url, files=files, headers=headers)
        encoder = MultipartEncoder(
            fields={
                'file': (file, open(file, 'rb'), 'application/json'),
                'data': json_data,
            }
        )
        response = requests.post(
            api_url,
            data=encoder,
            headers={'Content-Type': ''}
        )
        print(response.status_code)
        print(response)
    except Exception as e:
        print(f'request error : {e}')

def is_device_nearby(device_address):
    nearby_devices = bluetooth.discover_devices()
    for addr in nearby_devices:
        if addr == device_address:
            return True
    return False

def scan_for_devices():
    global blt_address, is_nearby, is_stream
    while True:
        if is_stream is False:
            if is_device_nearby(blt_address):
                print(f"Device {blt_address} is nearby.")
                is_nearby.append(True)
            else:
                is_nearby.append(False)
            print(list(is_nearby))
        time.sleep(30)

# schedule.every(1).minutes.do(thumbnail_capture)
# schedule.every(15).seconds.do(thumbnail_capture)

if __name__ == '__main__':
    global client
    mqtt_setup()
    scan_thread = threading.Thread(target=scan_for_devices)
    scan_thread.daemon = True  # 메인 스레드 종료 시 백그라운드 스레드도 종료됩니다.
    scan_thread.start()
    
    cap = cv2.VideoCapture(0)
    # is_first = False

    while True:
        schedule.run_pending()
        # 1. cap.open(0)일 때 (동작)
        if cap.isOpened():
            ret, frame = cap.read()
            if is_first:
                time.sleep(1)
                is_first = decode_qr(frame)
            else:
                now = datetime.now()
                nowDatetime = now.strftime('%Y-%m-%dT%H:%M:%SZ')
                nowDatetime_path = now.strftime('%Y-%m-%d %H_%M_%S')

                # 온습도 센싱
                # if is_req_temp_hmdt:
                #     upload_tmp_hmdt(nowDatetime)
                
                # 1-1. 외출 했을 때 (동작)
                try:
                    if is_system_on:
                        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                        faces = face_cascade.detectMultiScale(gray, scaleFactor= 1.5, minNeighbors=3, minSize=(20,20))
                    
                        # 1-1-1. 특정 대상이 감지됐을 때
                        if len(faces):
                            print('detected something')
                            if True in is_nearby:
                                is_system_on = False
                                print('device is nearby. system off')
                                continue
                            is_detected = True
                            print('invasion detected')
                            if on_record == False:  # 현재 녹화상태가 아니면
                                # 영상 파일을 쓸 준비 (파일명, 인코더, fps, 영상크기)
                                detect_file_name = f'detected_{nowDatetime_path}.mp4'
                                detected_video = cv2.VideoWriter(detect_file_name, fourcc, 15, (frame.shape[1], frame.shape[0]))
                                print(nowDatetime, '감지 시작')
                                detected_data = {
                                    "camId": cam_id,
                                    "occurredAt": nowDatetime,
                                    "type": "INVASION"
                                }
                                json_data = json.dumps(detected_data)
                                client.publish('server/event', json_data)
                                record_data = {
                                    "startTime": nowDatetime,
                                    "endTime": "yyyy-mm-ddThh:mm:ssZ"
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
                                # video_upload(detect_file_name, json_data)

                        # 1-1-2. 녹화버튼 눌렀을 때 (주석처리됨. 기능안함)
                        if start_record == True and is_record == False:
                            # is_record = True            # 녹화상태로 만들어줌
                            # start_record = False        # start_record는 거짓으로
                            # # 영상 파일을 쓸 준비 (파일명, 인코더, fps, 영상크기)
                            # record_file_name = f'recorded_{nowDatetime_path}.avi'
                            # record = cv2.VideoWriter(record_file_name, fourcc, 15, (frame.shape[1], frame.shape[0]))
                            # print(nowDatetime, '녹화 시작')
                            pass
                        elif start_record == True and is_record == True: # 녹화중인 상태에서 다시 녹화버튼을 누르면
                            # is_record = False       # 녹화상태를 꺼줌
                            # start_record = False
                            # record.release()         # 녹화 종료
                            # print(nowDatetime, '녹화 종료')
                            # # file_upload(record_file_name)
                            pass
                        if is_record == True:       # 현재 녹화상태이면            
                            # # 비디오 객체에 현재 프레임 저장
                            # record.write(frame)
                            pass
                        
                        # 1-1-3. 썸네일 캡쳐
                        if is_capture:
                            is_capture = False
                            thumbnail_file_name = f'thumbnail_{nowDatetime_path}.png'
                            cv2.imwrite(thumbnail_file_name, frame)  # 파일이름(한글안됨), 이미지
                            # file_upload(thumbnail_file_name, nowDatetime)
                            print(nowDatetime, 'thumbnail captured')

                        if is_stream:
                            # 위 과정으로 정재된 frame을 버퍼로 저장
                            ref, buffer = cv2.imencode('.jpg', frame)
                            frame = buffer.tobytes()
                            # 그림파일들을 쌓아두고 호출을 기다림 -> 스트리밍
                            # yield (b'--frame\r\n'
                            #     b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
                    
                    # 1-2. 귀가 했을 때 (대기)
                    else:
                        time.sleep(1)
                except Exception as e:
                    print(e)
        # 2. cap.close() 일 때 (대기)
        else:
            time.sleep(1)