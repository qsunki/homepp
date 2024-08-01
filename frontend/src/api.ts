import axios, { AxiosResponse } from 'axios';

// 백엔드 API 기본 URL 설정
const API_URL = 'http://i11a605.p.ssafy.io:8081/api/v1';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: API_URL,
});

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

// 공유 회원 데이터 타입 정의
export interface SharedMember {
  nickname: string;
  email: string;
}

// FCM 토큰 타입 정의
interface FcmToken {
  value: string;
}

// 캠 관련 타입 정의
interface Cam {
  camId: string;
  name?: string;
  status?: string;
}

// 이벤트 관련 타입 정의
interface Event {
  eventId: string;
  type: string;
  read: boolean;
  threat: boolean;
}

// 영상 관련 타입 정의
interface Video {
  camId: number;
  eventId: string;
  type: string;
  thumbnail: string;
  recordedAt?: string;
  url?: string;
  length?: number;
}

// 썸네일 타입 정의
interface Thumbnail {
  thumbnailUrl: string;
}

// 회원가입 API 호출 함수
export const registerUser = (
  userData: UserData
): Promise<AxiosResponse<UserData>> => {
  return api.post<UserData>('/members', userData);
};

// 로그인 API 호출 함수
export const loginUser = (
  loginData: LoginData
): Promise<AxiosResponse<LoginData>> => {
  return api.post<LoginData>('/members/login', loginData);
};

// 이메일 중복 확인 API 호출 함수
export const checkEmailExists = (
  email: string
): Promise<AxiosResponse<{ exists: boolean }>> => {
  return api.get<{ exists: boolean }>(`/members/emails/${email}`);
};

// 전화번호 중복 확인 API 호출 함수
export const checkPhoneNumberExists = (
  phoneNumber: string
): Promise<AxiosResponse<{ exists: boolean }>> => {
  return api.get<{ exists: boolean }>(`/members/phone-numbers/${phoneNumber}`);
};

// 비밀번호 변경 API 호출 함수
export const updateUserPassword = (
  email: string,
  password: string
): Promise<AxiosResponse<UserData>> => {
  return api.patch<UserData>(`/members/emails/${email}`, { password });
};

// 회원 탈퇴 API 호출 함수
export const deleteUser = (email: string): Promise<AxiosResponse<void>> => {
  return api.delete<void>(`/members/emails/${email}`);
};

// 공유회원 리스트 API 호출 함수
export const getSharedMembers = (
  email: string
): Promise<AxiosResponse<SharedMember[]>> => {
  return api.get<SharedMember[]>(`/members/${email}/sharedMembers`);
};

// 공유회원 추가 API 호출 함수
export const addSharedMember = (
  email: string,
  sharedMember: SharedMember
): Promise<AxiosResponse<SharedMember>> => {
  return api.post<SharedMember>(
    `/members/${email}/sharedMembers`,
    sharedMember
  );
};

// 공유회원 수정 API 호출 함수
export const updateSharedMember = (
  email: string,
  sharedMemberEmail: string,
  sharedMember: SharedMember
): Promise<AxiosResponse<SharedMember>> => {
  return api.patch<SharedMember>(
    `/members/${email}/sharedMembers/${sharedMemberEmail}`,
    sharedMember
  );
};

// 공유회원 삭제 API 호출 함수
export const removeSharedMember = (
  email: string,
  sharedMemberEmail: string
): Promise<AxiosResponse<void>> => {
  return api.delete<void>(
    `/members/${email}/sharedMembers/${sharedMemberEmail}`
  );
};

// 로그아웃 API 호출 함수
export const logoutUser = (): Promise<AxiosResponse<void>> => {
  return api.post<void>('/members/logout');
};

// FCM 토큰 등록 API 호출 함수
export const registerFcmToken = (
  fcmToken: FcmToken
): Promise<AxiosResponse<FcmToken>> => {
  return api.post<FcmToken>('/members/tokens', fcmToken);
};

// 캠 리스트 API 호출 함수
export const getCams = (): Promise<AxiosResponse<Cam[]>> => {
  return api.get<Cam[]>('/cams');
};

// 캠 등록 API 호출 함수
export const registerCam = (cam: Cam): Promise<AxiosResponse<Cam>> => {
  return api.post<Cam>('/cams', cam);
};

// 캠 정보 수정 API 호출 함수
export const updateCam = (
  camId: string,
  cam: Cam
): Promise<AxiosResponse<Cam>> => {
  return api.patch<Cam>(`/cams/${camId}`, cam);
};

// 캠 삭제 API 호출 함수
export const removeCam = (camId: string): Promise<AxiosResponse<void>> => {
  return api.delete<void>(`/cams/${camId}`);
};

// 실시간 영상 시청 API 호출 함수
export const getLiveCam = (camId: string): Promise<AxiosResponse<Blob>> => {
  return api.get<Blob>(`/cams/${camId}/live`);
};

// 실시간 썸네일 API 호출 함수
export const getCamThumbnail = (
  camId: string
): Promise<AxiosResponse<Thumbnail>> => {
  return api.get<Thumbnail>(`/cams/${camId}/thumbnail`);
};

// 캠 녹화 API 호출 함수
export const recordCam = (
  camId: string,
  startAt: string,
  endAt: string
): Promise<AxiosResponse<void>> => {
  return api.post<void>(`/cams/${camId}/record`, { startAt, endAt });
};

// 이벤트 목록 API 호출 함수
export const getEvents = (): Promise<AxiosResponse<Event[]>> => {
  return api.get<Event[]>('/events');
};

// 이벤트 읽음 처리 API 호출 함수
export const markEventAsRead = (
  eventId: string
): Promise<AxiosResponse<Event>> => {
  return api.patch<Event>(`/events/${eventId}`, { read: true });
};

// 위협 등록 API 호출 함수
export const registerThreat = (
  eventId: string,
  threat: boolean
): Promise<AxiosResponse<Event>> => {
  return api.patch<Event>(`/events/${eventId}`, { threat });
};

// 녹화 영상 목록 API 호출 함수
export const getVideos = (params: {
  type?: string;
  startDate?: string;
  endDate?: string;
  camId?: string;
}): Promise<AxiosResponse<Video[]>> => {
  return api.get<Video[]>('/cams/videos', { params });
};

// 영상 시청 API 호출 함수
export const getVideo = (
  camId: string,
  videoId: string
): Promise<AxiosResponse<Video>> => {
  return api.get<Video>(`/cams/${camId}/videos/${videoId}`);
};

// 영상 다운로드 API 호출 함수
export const downloadVideo = (
  camId: string,
  videoId: string
): Promise<AxiosResponse<{ url: string }>> => {
  return api.get<{ url: string }>(`/cams/${camId}/videos/${videoId}`);
};

// 영상 삭제 API 호출 함수
export const deleteVideo = (
  camId: string,
  videoId: string
): Promise<AxiosResponse<void>> => {
  return api.delete<void>(`/cams/${camId}/videos/${videoId}`);
};

// 사용자 초대 API 호출 함수
export const inviteUser = (
  email: string,
  inviteEmail: string
): Promise<AxiosResponse<{ email: string }>> => {
  return api.post<{ email: string }>(`/members/${email}/invitations`, {
    email: inviteEmail,
  });
};

// 초대한 사용자 삭제 API 호출 함수
export const removeInvitedUser = (
  email: string,
  inviteEmail: string
): Promise<AxiosResponse<void>> => {
  return api.delete<void>(`/members/${email}/invitations`, {
    data: { email: inviteEmail },
  });
};

// 온도 조회 API 호출 함수
export const getTemperatures = (
  camId: string
): Promise<AxiosResponse<unknown>> => {
  return api.get<unknown>(`/cams/${camId}/temperatures`);
};

// 습도 조회 API 호출 함수
export const getHumidities = (
  camId: string
): Promise<AxiosResponse<unknown>> => {
  return api.get<unknown>(`/cams/${camId}/humidities`);
};
