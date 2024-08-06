import axios, { AxiosResponse } from 'axios';

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
interface CamData {
  camId: number;
  name: string;
  status?: string; // status 속성 추가
}

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

export interface SharedMember {
  nickname: string;
  email: string;
}

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
    console.log('서버에 FCM 토큰 전송 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to send FCM token to server:', error);
    throw error;
  }
};

export default api;
