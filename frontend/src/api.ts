import axios, { AxiosResponse } from 'axios';
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';

// 백엔드 API 기본 URL 설정
const API_URL = 'https://i11a605.p.ssafy.io/api/v1';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 토큰을 설정하는 함수
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    // console.log('Authorization token set:', token); // 디버깅용 콘솔 출력
  } else {
    delete api.defaults.headers.common['Authorization'];
    // console.log('Authorization token removed'); // 디버깅용 콘솔 출력
  }
};

// 로컬 스토리지에서 토큰을 가져와 설정
const token = localStorage.getItem('token');
if (token) {
  setAuthToken(token); // 저장된 토큰이 있으면 설정
}

// 인터셉터 추가하여 요청 설정을 확인
api.interceptors.request.use(
  (config) => {
    // console.log('Request config:', config); // 요청 설정을 콘솔에 출력
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 사용자 데이터 타입 정의
export interface UserData {
  email: string;
  phoneNumber: string;
  password: string;
  userId?: number;
}

// 로그인 데이터 타입 정의
interface LoginData {
  email: string;
  password: string;
  userId?: number;
  phoneNumber?: string;
}

// 캠 데이터 타입 정의
export interface CamData {
  camId: number;
  name: string;
  status?: string; // status 속성 추가
}

// 비디오 데이터 타입 정의
export interface Video {
  streamUrl: string;
  videoId: number;
  camName: string;
  recordStartAt: string;
  length: number;
  events: {
    occurredAt: string;
    type: string;
  }[];
  thumbnailUrl: string;
  threat: boolean;
}

export type ApiVideo = Video;

// 공유 사용자 데이터 타입 정의
export interface SharedMember {
  nickname: string;
  email: string;
}

// 감지 이벤트 데이터 타입 정의
export interface Event {
  eventId: number;
  isRead: boolean;
  camId: number;
  camName: string;
  eventType: string;
  videoId: number;
  occuredAt: string;
}

// 위협 알림 데이터 타입 정의
export interface Threat {
  isRead: boolean;
  recordStartedAt: string;
  region: string;
  eventTypes: string[];
  threatId: number;
}

// 로그인 API 호출 함수
export const loginUser = async (
  loginData: LoginData
): Promise<AxiosResponse<{ accessToken: string; userId: number }>> => {
  try {
    const response = await api.post<{ accessToken: string; userId: number }>(
      '/members/login',
      loginData
    );
    const { accessToken } = response.data;
    setAuthToken(accessToken); // 로그인 성공 시 토큰 설정
    localStorage.setItem('token', accessToken); // 로컬 스토리지에 토큰 저장
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        '로그인 오류:',
        error.response ? error.response.data : error.message
      );
    } else {
      console.error('로그인 오류:', error);
    }
    throw error;
  }
};

// JWT 토큰 재발행 API 호출 함수
export const reissueToken = async (
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    const response = await api.post<{
      accessToken: string;
      refreshToken: string;
    }>('/members/reissue', { refreshToken });
    const { accessToken, refreshToken: newRefreshToken } = response.data;
    setAuthToken(accessToken); // 새로운 accessToken 설정
    localStorage.setItem('token', accessToken); // 새로운 accessToken 저장
    localStorage.setItem('refreshToken', newRefreshToken); // 새로운 refreshToken 저장
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        '토큰 재발행 오류:',
        error.response ? error.response.data : error.message
      );
    } else {
      console.error('토큰 재발행 오류:', error);
    }
    throw error;
  }
};

// 회원가입 API 호출 함수
export const registerUser = async (
  userData: UserData
): Promise<AxiosResponse<UserData>> => {
  try {
    return await api.post<UserData>('/members', userData);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        '회원가입 오류:',
        error.response ? error.response.data : error.message
      );
    } else {
      console.error('회원가입 오류:', error);
    }
    throw error;
  }
};

// 중복 이메일 체크 API 호출 함수
export const checkDuplicateEmail = async (email: string): Promise<boolean> => {
  try {
    // console.log(`Checking duplicate email: ${email}`);
    const response = await api.get<boolean>(`/members/emails/${email}`);
    // console.log('Email check response:', response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        '중복 이메일 체크 오류:',
        error.response ? error.response.data : error.message
      );
    } else {
      console.error('중복 이메일 체크 오류:', error);
    }
    throw error;
  }
};

// 중복 전화번호 체크 API 호출 함수
export const checkDuplicatePhoneNumber = async (
  phoneNumber: string
): Promise<boolean> => {
  try {
    // console.log(`Checking duplicate phone number: ${phoneNumber}`);
    const response = await api.get<boolean>(
      `/members/phone-numbers/${phoneNumber}`
    );
    // console.log('Phone number check response:', response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        '중복 전화번호 체크 오류:',
        error.response ? error.response.data : error.message
      );
    } else {
      console.error('중복 전화번호 체크 오류:', error);
    }
    throw error;
  }
};

// 회원 정보 조회 API 호출 함수 (토큰 유효성 검사)
export const getUserInfo = async (): Promise<AxiosResponse<string>> => {
  try {
    const response = await api.get<string>('/members');
    // console.log('getUserInfo API response:', response.data); // API 응답 확인
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        '회원 정보 조회 오류:',
        error.response ? error.response.data : error.message
      );
    } else {
      console.error('회원 정보 조회 오류:', error);
    }
    throw error;
  }
};

// 캠 리스트 조회 API 호출 함수
export const fetchCams = async (): Promise<AxiosResponse<CamData[]>> => {
  try {
    return await api.get<CamData[]>('/cams');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        '캠 리스트 조회 오류:',
        error.response ? error.response.data : error.message
      );
    } else {
      console.error('캠 리스트 조회 오류:', error);
    }
    throw error;
  }
};

// 캠 수정 API 호출 함수 (등록, 이름변경, 삭제)
export const updateCam = async (
  camId: number,
  data: Partial<CamData>
): Promise<AxiosResponse<CamData>> => {
  try {
    return await api.patch<CamData>(`/cams/${camId}`, data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        '캠 수정 오류:',
        error.response ? error.response.data : error.message
      );
    } else {
      console.error('캠 수정 오류:', error);
    }
    throw error;
  }
};

// 기기 삭제 API 호출 함수
export const deleteCam = async (
  camId: number
): Promise<AxiosResponse<void>> => {
  try {
    return await api.delete<void>(`/cams/${camId}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        '캠 삭제 오류:',
        error.response ? error.response.data : error.message
      );
    } else {
      console.error('캠 삭제 오류:', error);
    }
    throw error;
  }
};

// 비디오 목록 조회 API 호출 함수
export const fetchVideos = async (params?: {
  types?: string[];
  startDate?: string;
  endDate?: string;
  camId?: number;
  isThreat?: boolean;
}): Promise<AxiosResponse<Video[]>> => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.types && params.types.length) {
      params.types.forEach((type) =>
        queryParams.append('types', type.toUpperCase())
      );
    }
    if (params?.startDate)
      queryParams.append('startDate', `${params.startDate}Z`);
    if (params?.endDate) queryParams.append('endDate', `${params.endDate}Z`);
    if (params?.camId) queryParams.append('camId', params.camId.toString());
    if (params?.isThreat !== undefined)
      queryParams.append('isThreat', params.isThreat.toString());

    const response = await api.get<Video[]>(
      `/cams/videos?${queryParams.toString()}`
    );
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        '비디오 목록 조회 오류:',
        error.response ? error.response.data : error.message
      );
    } else {
      console.error('비디오 목록 조회 오류:', error);
    }
    throw error;
  }
};

// 특정 비디오 조회 API 호출 함수 수정
export const fetchVideoById = async (
  videoId: number
): Promise<AxiosResponse<Video>> => {
  try {
    const response = await api.get<Video>(`/cams/videos/${videoId}`);
    const videoData = response.data;

    // isThreat 필드를 이용해 isReported 상태를 설정
    const video = {
      ...videoData,
      recordStartAt: `${videoData.recordStartAt}Z`, // Z를 추가하여 UTC로 변환
      events: videoData.events.map((event) => ({
        ...event,
        occurredAt: `${event.occurredAt}Z`, // Z를 추가하여 UTC로 변환
      })),
    };

    return {
      ...response,
      data: video,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        '비디오 조회 오류:',
        error.response ? error.response.data : error.message
      );
    } else {
      console.error('비디오 조회 오류:', error);
    }
    throw error;
  }
};

// 비디오 스트림 가져오기 함수 추가
export const fetchVideoStream = async (videoId: number): Promise<string> => {
  try {
    const response = await api.get<{ url: string }>(
      `/cams/videos/${videoId}/stream`
    );
    return response.data.url; // API로부터 받은 스트림 URL을 반환
  } catch (error) {
    console.error('비디오 스트림 가져오기 오류:', error);
    throw error;
  }
};

// 썸네일 가져오기 함수
export const fetchThumbnail = async (videoId: number): Promise<string> => {
  try {
    const response = await api.get(`/cams/videos/${videoId}/thumbnail`);
    // response.data에 썸네일의 경로가 포함된다고 가정합니다.
    const imageUrl = response.data;
    // console.log('Fetched thumbnail URL:', imageUrl); // URL 콘솔 출력
    return imageUrl;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        '썸네일 가져오기 오류:',
        error.response ? error.response.data : error.message
      );
    } else {
      console.error('썸네일 가져오기 오류:', error);
    }
    throw error;
  }
};

// 캠의 WebSocket 키 조회 API 호출 함수 추가
export const fetchWebSocketKey = async (camId: string): Promise<string> => {
  try {
    const response = await api.get<{ key: string }>(`/cams/${camId}/stream`);
    return response.data.key;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        'WebSocket 키 조회 오류:',
        error.response ? error.response.data : error.message
      );
    } else {
      console.error('WebSocket 키 조회 오류:', error);
    }
    throw error;
  }
};

// WebSocket 연결 및 메시지 전송 함수
export const connectWebSocket = (
  key: string,
  onMessage: (message: IMessage) => void
): Client => {
  const socket = new SockJS('http://i11a605.p.ssafy.io:8081/ws');
  const client = new Client({
    webSocketFactory: () => socket,
    debug: (str) => {
      console.log('STOMP Debug: ', str);
    },
    onConnect: (frame) => {
      console.log('STOMP client connected, frame:', frame);
      client.subscribe(`/sub/client/${key}`, onMessage);
    },
    onStompError: (frame) => {
      console.error('Broker reported error:', frame.headers['message']);
      console.error('Additional details:', frame.body);
    },
    onDisconnect: () => {
      // console.log('STOMP client disconnected');
    },
  });

  client.activate();
  return client;
};

// WebSocket 메시지 발행 함수
export const publishWebSocketMessage = (
  client: Client,
  key: string,
  message: object
) => {
  if (client && client.connected) {
    client.publish({
      destination: `/pub/client/${key}`,
      body: JSON.stringify(message),
    });
    // console.log('Published message:', message);
  } else {
    console.error('STOMP client is not connected');
  }
};

// 공유 사용자 조회
export const fetchSharedMembers = async (
  email: string
): Promise<AxiosResponse<SharedMember[]>> => {
  const encodedEmail = encodeURIComponent(email);
  return await api.get<SharedMember[]>(
    `/members/${encodedEmail}/sharedMembers`
  );
};

// 공유 사용자 추가
export const addSharedMember = async (
  email: string,
  sharedMember: SharedMember
): Promise<AxiosResponse<SharedMember>> => {
  const encodedEmail = encodeURIComponent(email);
  return await api.post<SharedMember>(
    `/members/${encodedEmail}/sharedMembers`,
    sharedMember
  );
};

// 공유 사용자 수정
export const updateSharedMember = async (
  email: string,
  sharedMemberEmail: string,
  nickname: string
): Promise<AxiosResponse<SharedMember>> => {
  const encodedEmail = encodeURIComponent(email);
  const encodedSharedMemberEmail = encodeURIComponent(sharedMemberEmail);
  return await api.patch<SharedMember>(
    `/members/${encodedEmail}/sharedMembers/${encodedSharedMemberEmail}`,
    { email: sharedMemberEmail, nickname }
  );
};

// 공유 사용자 삭제
export const deleteSharedMember = async (
  email: string,
  sharedMemberEmail: string
): Promise<AxiosResponse<void>> => {
  const encodedEmail = encodeURIComponent(email);
  const encodedSharedMemberEmail = encodeURIComponent(sharedMemberEmail);
  return await api.delete<void>(
    `/members/${encodedEmail}/sharedMembers/${encodedSharedMemberEmail}`
  );
};

// FCM 토큰을 서버로 전송하는 함수
export const sendFcmTokenToServer = async (email: string, token: string) => {
  try {
    const response = await api.post(
      `/members/${encodeURIComponent(email)}/tokens`,
      { token }
    );
    // console.log('서버에 FCM 토큰 전송 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to send FCM token to server:', error);
    throw error;
  }
};

// 실시간 썸네일 가져오기 API 호출 함수
export const fetchLiveThumbnail = async (camId: number): Promise<string> => {
  try {
    // console.log('Fetching live thumbnail for camId:', camId);
    const response = await api.get(`/cams/${camId}/thumbnail`, {
      responseType: 'blob',
    });
    const imageUrl = URL.createObjectURL(response.data);
    // console.log('Live thumbnail URL:', imageUrl);
    return imageUrl;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        '실시간 썸네일 가져오기 오류:',
        error.response ? error.response.data : error.message
      );
      if (error.response) {
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
        console.error('Error response data:', error.response.data);
      }
    } else {
      console.error('실시간 썸네일 가져오기 오류:', error);
    }
    throw error;
  }
};

// 오늘 발생한 총 감지 이벤트 수 API 호출 함수
export const fetchEventCount = async (): Promise<number> => {
  try {
    const response: AxiosResponse<number> = await api.get<number>(
      '/events/count'
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        '이벤트 수 가져오기 오류:',
        error.response ? error.response.data : error.message
      );
    } else {
      console.error('이벤트 수 가져오기 오류:', error);
    }
    throw error;
  }
};

// 최신 온도 및 습도 API 호출 함수
export const fetchLatestEnvInfo = async (
  camId: number
): Promise<{ temperature: number; humidity: number; status: string }> => {
  try {
    const response: AxiosResponse<{
      temperature: number;
      humidity: number;
      status: string;
    }> = await api.get<{
      temperature: number;
      humidity: number;
      status: string;
    }>(`/cams/${camId}/envInfo`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        '최신 환경정보 가져오기 오류:',
        error.response ? error.response.data : error.message
      );
    } else {
      console.error('최신 환경정보 가져오기 오류:', error);
    }
    throw error;
  }
};

// 감지 이벤트 목록 조회 API 호출 함수
export const fetchEventList = async (): Promise<Event[]> => {
  try {
    const response = await api.get<Event[]>('/events');
    // console.log('Fetched events:', response.data); // 로그 추가
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        '이벤트 목록 조회 오류:',
        error.response ? error.response.data : error.message
      );
    } else {
      console.error('이벤트 목록 조회 오류:', error);
    }
    throw error;
  }
};

// 위협 알림 목록 조회 API 호출 함수
export const fetchThreatList = async (email: string): Promise<Threat[]> => {
  try {
    const response = await api.get<Threat[]>(`/members/${email}/threats`);
    // console.log('Fetched threats:', response.data); // 로그 추가
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        '위협 알림 목록 조회 오류:',
        error.response ? error.response.data : error.message
      );
    } else {
      console.error('위협 알림 목록 조회 오류:', error);
    }
    throw error;
  }
};

// 읽음 상태 업데이트 API 호출 함수
export const updateReadStatus = async (
  type: 'event' | 'threat',
  id: number
): Promise<void> => {
  try {
    const endpoint =
      type === 'event' ? `/events/${id}` : `/members/threats/${id}`;
    await api.patch(endpoint, { isRead: true });
    // console.log(`Updated read status for ${type} with ID ${id}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        '읽음 상태 업데이트 오류:',
        error.response ? error.response.data : error.message
      );
    } else {
      console.error('읽음 상태 업데이트 오류:', error);
    }
    throw error;
  }
};

// 알림 삭제 API 호출 함수
export const deleteNotification = async (
  type: 'event' | 'threat',
  id: number
): Promise<void> => {
  try {
    const endpoint =
      type === 'event' ? `/events/${id}` : `/members/threats/${id}`;
    await api.delete(endpoint);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        '알림 삭제 오류:',
        error.response ? error.response.data : error.message
      );
    } else {
      console.error('알림 삭제 오류:', error);
    }
    throw error;
  }
};

// 캠 실시간 감지 제어 API 호출 함수
export const controlCameraDetection = async (
  camId: number,
  command: 'start' | 'end',
  webSocketKey: string
): Promise<void> => {
  try {
    // WebSocket 키와 command를 요청 본문에 담아서 전송
    const requestBody = {
      command,
    };
    await api.post(`/cams/${camId}/control`, requestBody);
    // console.log(
    //   `Camera detection ${command} command sent successfully for camId ${camId} with key ${webSocketKey}`
    // );
  } catch (error) {
    console.error(
      `Failed to send ${command} command for camId ${camId} with key ${webSocketKey}:`,
      error
    );
    throw error;
  }
};

// 모든 카메라의 실시간 감지 모드를 동시에 제어하는 함수
export const controlAllCamerasDetection = async (
  camIds: number[],
  command: 'start' | 'end',
  webSocketKey: string
): Promise<void> => {
  try {
    const promises = camIds.map((camId) =>
      controlCameraDetection(camId, command, webSocketKey)
    );
    await Promise.all(promises); // 모든 요청이 완료될 때까지 기다림
    // console.log(`All cameras detection ${command} command sent successfully`);
  } catch (error) {
    console.error(`Failed to send ${command} command to all cameras:`, error);
    throw error;
  }
};

// 캠 실시간 스트리밍 제어 API 호출 함수
export const controlCameraStream = async (
  camId: number,
  command: 'start' | 'end',
  webSocketKey: string
): Promise<void> => {
  try {
    // WebSocket 키와 command를 요청 본문에 담아서 전송
    const requestBody = {
      key: webSocketKey,
      command,
    };
    await api.post(`/cams/${camId}/stream`, requestBody);
    // console.log(
    //   `Camera stream ${command} command sent successfully for camId ${camId} with key ${webSocketKey}`
    // );
  } catch (error) {
    console.error(
      `Failed to send ${command} command for camId ${camId} with key ${webSocketKey}:`,
      error
    );
    throw error;
  }
};

// 모든 카메라의 실시간 스트리밍 모드를 동시에 제어하는 함수
export const controlAllCamerasStream = async (
  camIds: number[],
  command: 'start' | 'end',
  webSocketKey: string
): Promise<void> => {
  try {
    const promises = camIds.map((camId) =>
      controlCameraStream(camId, command, webSocketKey)
    );
    await Promise.all(promises); // 모든 요청이 완료될 때까지 기다림
    // console.log(`All cameras stream ${command} command sent successfully`);
  } catch (error) {
    console.error(`Failed to send ${command} command to all cameras:`, error);
    throw error;
  }
};

// 공유 받은 캠 리스트 조회 API 호출 함수
export interface SharedCamData {
  camId: number;
  name: string;
  thumbnail: string;
}

export const fetchSharedCams = async (): Promise<
  AxiosResponse<SharedCamData[]>
> => {
  try {
    const response = await api.get<SharedCamData[]>('/cams/shared');
    // console.log('Fetched shared cams:', response.data); // 로그 추가
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        '공유 받은 캠 리스트 조회 오류:',
        error.response ? error.response.data : error.message
      );
    } else {
      console.error('공유 받은 캠 리스트 조회 오류:', error);
    }
    throw error;
  }
};

export default api;
