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
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

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

// 공유 사용자 데이터 타입 정의
export interface SharedMember {
  nickname: string;
  email: string;
}

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
    console.log(`Checking duplicate email: ${email}`);
    const response = await api.get<boolean>(`/members/emails/${email}`);
    console.log('Email check response:', response.data);
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
    console.log(`Checking duplicate phone number: ${phoneNumber}`);
    const response = await api.get<boolean>(
      `/members/phone-numbers/${phoneNumber}`
    );
    console.log('Phone number check response:', response.data);
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

// 로그인 API 호출 함수
export const loginUser = async (
  loginData: LoginData
): Promise<AxiosResponse<{ accessToken: string; userId: number }>> => {
  try {
    const response = await api.post<{ accessToken: string; userId: number }>(
      '/members/login',
      loginData
    );
    setAuthToken(response.data.accessToken); // 로그인 성공 시 토큰 설정
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

// 회원 정보 조회 API 호출 함수 (토큰 유효성 검사)
export const getUserInfo = async (): Promise<AxiosResponse<string>> => {
  try {
    const response = await api.get<string>('/members');
    console.log('getUserInfo API response:', response.data); // API 응답 확인
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
      console.log('STOMP client disconnected');
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
    console.log('Published message:', message);
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

export default api;
