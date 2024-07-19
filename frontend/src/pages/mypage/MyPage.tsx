import React from 'react';
import editIcon from '../../asset/mypage/editIcon.png';
import deviceManagementIcon from '../../asset/mypage/deviceManagementIcon.png';
import camSharingIcon from '../../asset/mypage/camSharingIcon.png';
import announcementIcon from '../../asset/mypage/announcementIcon.png';
import faqIcon from '../../asset/mypage/faqIcon.png';
import termsIcon from '../../asset/mypage/termsIcon.png';
import helpDeskIcon from '../../asset/mypage/helpDeskIcon.png';
import securityIcon from '../../asset/mypage/securityIcon.png';
import settingsIcon from '../../asset/mypage/settingsIcon.png';
import style from './MyPage.module.css';

const MyPage: React.FC = () => {
  return (
    <div className={style.myPage}>
      <div className={style.helloText}>
        <span>안녕하세요, User님</span>
        <img src={editIcon} alt="editIcon" className={style.editIcon} />
      </div>
      <div className={style.container}>
        <div className={style.borderBox}>
          <img
            src={deviceManagementIcon}
            alt="deviceManagementIcon"
            className={style.borderBoxIcon}
          />
          <span>기기 관리</span>
        </div>
        <div className={style.borderBox}>
          <img
            src={camSharingIcon}
            alt="camSharingIcon"
            className={style.borderBoxIcon}
          />
          <span>캠 공유하기</span>
        </div>
      </div>
      <div className={style.container}>
        <div className={style.borderBox}>
          <img
            src={announcementIcon}
            alt="announcementIcon"
            className={style.borderBoxIcon}
          />
          <span>공지사항</span>
        </div>
        <div className={style.borderBox}>
          <img src={faqIcon} alt="faqIcon" className={style.borderBoxIcon} />
          <span>자주 묻는 질문</span>
        </div>
      </div>
      <div className={style.container}>
        <div className={style.borderBox}>
          <img
            src={termsIcon}
            alt="termsIcon"
            className={style.borderBoxIcon}
          />
          <span>이용약관</span>
        </div>
        <div className={style.borderBox}>
          <img
            src={helpDeskIcon}
            alt="helpDeskIcon"
            className={style.borderBoxIcon}
          />
          <span>고객 지원</span>
        </div>
      </div>
      <div className={style.container}>
        <div className={style.borderBox}>
          <img
            src={securityIcon}
            alt="securityIcon"
            className={style.borderBoxIcon}
          />
          <span>개인정보 처리방침</span>
        </div>
        <div className={style.borderBox}>
          <img
            src={settingsIcon}
            alt="settingsIcon"
            className={style.borderBoxIcon}
          />
          <span>설정</span>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
