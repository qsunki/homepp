import axios, { AxiosResponse } from 'axios';

// 백엔드 API 기본 URL 설정
const API_URL = 'http://i11a605.p.ssafy.io:8081/api/v1';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: API_URL,
});

// 토큰을 설정하는 함수
export const setAuthToken = (token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// 사용자 데이터 타입 정의
interface UserData {
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

export default api;
