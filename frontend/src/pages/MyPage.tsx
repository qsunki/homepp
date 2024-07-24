import React from 'react';
import editIcon from '../asset/mypage/editIcon.png';
import deviceManagementIcon from '../asset/mypage/deviceManagementIcon.png';
import camSharingIcon from '../asset/mypage/camSharingIcon.png';
import announcementIcon from '../asset/mypage/announcementIcon.png';
import faqIcon from '../asset/mypage/faqIcon.png';
import termsIcon from '../asset/mypage/termsIcon.png';
import helpDeskIcon from '../asset/mypage/helpDeskIcon.png';
import securityIcon from '../asset/mypage/securityIcon.png';
import settingsIcon from '../asset/mypage/settingsIcon.png';

const MyPage: React.FC = () => {
  return (
    <div className="flex flex-col py-12 px-0 mx-48 mb-12">
      <div className="flex py-12">
        <span className="text-[#1e1e1e] font-[Inter-Medium] text-2xl font-medium leading-[45px] tracking-[-0.57px]">
          안녕하세요, User님
        </span>
        <img src={editIcon} alt="editIcon" className="pl-5 h-10" />
      </div>
      <div className="flex justify-between py-5">
        <div className="flex items-center justify-center border-4 border-[#c1c1c17b] rounded-md w-[45%] h-28 relative">
          <img
            src={deviceManagementIcon}
            alt="deviceManagementIcon"
            className="absolute left-[7%] top-1/2 transform -translate-y-1/2"
          />
          <span>기기 관리</span>
        </div>
        <div className="flex items-center justify-center border-4 border-[#c1c1c17b] rounded-md w-[45%] h-28 relative">
          <img
            src={camSharingIcon}
            alt="camSharingIcon"
            className="absolute left-[7%] top-1/2 transform -translate-y-1/2"
          />
          <span>캠 공유하기</span>
        </div>
      </div>
      <div className="flex justify-between py-5">
        <div className="flex items-center justify-center border-4 border-[#c1c1c17b] rounded-md w-[45%] h-28 relative">
          <img
            src={announcementIcon}
            alt="announcementIcon"
            className="absolute left-[7%] top-1/2 transform -translate-y-1/2"
          />
          <span>공지사항</span>
        </div>
        <div className="flex items-center justify-center border-4 border-[#c1c1c17b] rounded-md w-[45%] h-28 relative">
          <img
            src={faqIcon}
            alt="faqIcon"
            className="absolute left-[7%] top-1/2 transform -translate-y-1/2"
          />
          <span>자주 묻는 질문</span>
        </div>
      </div>
      <div className="flex justify-between py-5">
        <div className="flex items-center justify-center border-4 border-[#c1c1c17b] rounded-md w-[45%] h-28 relative">
          <img
            src={termsIcon}
            alt="termsIcon"
            className="absolute left-[7%] top-1/2 transform -translate-y-1/2"
          />
          <span>이용약관</span>
        </div>
        <div className="flex items-center justify-center border-4 border-[#c1c1c17b] rounded-md w-[45%] h-28 relative">
          <img
            src={helpDeskIcon}
            alt="helpDeskIcon"
            className="absolute left-[7%] top-1/2 transform -translate-y-1/2"
          />
          <span>고객 지원</span>
        </div>
      </div>
      <div className="flex justify-between py-5">
        <div className="flex items-center justify-center border-4 border-[#c1c1c17b] rounded-md w-[45%] h-28 relative">
          <img
            src={securityIcon}
            alt="securityIcon"
            className="absolute left-[7%] top-1/2 transform -translate-y-1/2"
          />
          <span>개인정보 처리방침</span>
        </div>
        <div className="flex items-center justify-center border-4 border-[#c1c1c17b] rounded-md w-[45%] h-28 relative">
          <img
            src={settingsIcon}
            alt="settingsIcon"
            className="absolute left-[7%] top-1/2 transform -translate-y-1/2"
          />
          <span>설정</span>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
