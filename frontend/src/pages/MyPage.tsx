import React, { useState } from 'react';
import {
  MdEdit,
  MdAnnouncement,
  MdQuestionAnswer,
  MdSupportAgent,
  MdDevices,
  MdVideocam,
  MdSettings,
} from 'react-icons/md';
import Modal from '../components/mypage/Modal';
import PasswordInput from '../components/mypage/PasswordInput';
import EditProfile from '../components/mypage/EditProfile';
import Announcement from '../components/mypage/Announcement';
import FAQ from '../components/mypage/FAQ';
import Support from '../components/mypage/Support';
import DeviceManagement from '../components/mypage/DeviceManagement';
// import CamSharing from '../components/mypage/CamSharingManagement';
import Settings from '../components/mypage/Settings';
import { useUserStore } from '../stores/useUserStore';

const MyPage: React.FC = () => {
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const email = useUserStore((state) => state.email);
  const password = useUserStore((state) => state.password);

  const username = email.split('@')[0]; // 이메일에서 '@' 앞부분을 추출

  const openModal = (content: React.ReactNode) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
    setErrorMessage('');
  };

  const verifyPassword = (inputPassword: string) => {
    if (inputPassword === password) {
      openModal(<EditProfile onClose={closeModal} />);
    } else {
      setErrorMessage('비밀번호가 틀렸습니다.');
      openModal(
        <PasswordInput
          onPasswordVerify={verifyPassword}
          errorMessage={'비밀번호가 틀렸습니다.'}
        />
      );
    }
  };

  const handleEditProfile = () => {
    openModal(
      <PasswordInput
        onPasswordVerify={verifyPassword}
        errorMessage={errorMessage}
      />
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50">
      <div className="mt-20">
        <h1 className="text-xl font-bold flex items-center">
          안녕하세요, {username}님{' '}
          <MdEdit
            className="ml-2 w-6 h-6 cursor-pointer"
            onClick={handleEditProfile}
          />
        </h1>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-10">
        <div
          className="relative flex items-center justify-center w-40 h-40 overflow-hidden bg-white shadow-lg rounded-xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.320,1)] group cursor-pointer"
          onClick={() => openModal(<Announcement />)}
        >
          <div className="flex flex-col items-center gap-2 text-gray-900 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.320,1)] group-hover:z-10 group-hover:text-white">
            <MdAnnouncement className="text-3xl" />
            <p className="mt-2">공지사항</p>
          </div>
          <div className="absolute left-0 bottom-0 w-1 h-full bg-gradient-to-r from-[#373b44] to-[#4286f4] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.320,1)] group-hover:w-full"></div>
        </div>
        <div
          className="relative flex items-center justify-center w-40 h-40 overflow-hidden bg-white shadow-lg rounded-xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.320,1)] group cursor-pointer"
          onClick={() => openModal(<FAQ />)}
        >
          <div className="flex flex-col items-center gap-2 text-gray-900 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.320,1)] group-hover:z-10 group-hover:text-white">
            <MdQuestionAnswer className="text-3xl" />
            <p className="mt-2">자주 묻는 질문</p>
          </div>
          <div className="absolute left-0 bottom-0 w-1 h-full bg-gradient-to-r from-[#4286f4] to-[#373b44] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.320,1)] group-hover:w-full"></div>
        </div>

        <div
          className="relative flex items-center justify-center w-40 h-40 overflow-hidden bg-white shadow-lg rounded-xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.320,1)] group cursor-pointer"
          onClick={() => openModal(<Support />)}
        >
          <div className="flex flex-col items-center gap-2 text-gray-900 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.320,1)] group-hover:z-10 group-hover:text-white">
            <MdSupportAgent className="text-3xl" />
            <p className="mt-2">고객 지원</p>
          </div>
          <div className="absolute left-0 bottom-0 w-1 h-full bg-gradient-to-r from-[#373b44] to-[#4286f4] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.320,1)] group-hover:w-full"></div>
        </div>
        <div
          className="relative flex items-center justify-center w-40 h-40 overflow-hidden bg-white shadow-lg rounded-xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.320,1)] group cursor-pointer"
          onClick={() => openModal(<DeviceManagement />)}
        >
          <div className="flex flex-col items-center gap-2 text-gray-900 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.320,1)] group-hover:z-10 group-hover:text-white">
            <MdDevices className="text-3xl" />
            <p className="mt-2">기기 관리</p>
          </div>
          <div className="absolute left-0 bottom-0 w-1 h-full bg-gradient-to-r from-[#4286f4] to-[#373b44] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.320,1)] group-hover:w-full"></div>
        </div>
        <div
          className="relative flex items-center justify-center w-40 h-40 overflow-hidden bg-white shadow-lg rounded-xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.320,1)] group cursor-pointer"
          // onClick={() => openModal(<CamSharing />)}
        >
          <div className="flex flex-col items-center gap-2 text-gray-900 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.320,1)] group-hover:z-10 group-hover:text-white">
            <MdVideocam className="text-3xl" />
            <p className="mt-2">캠 공유하기</p>
          </div>
          <div className="absolute left-0 bottom-0 w-1 h-full bg-gradient-to-r from-[#373b44] to-[#4286f4] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.320,1)] group-hover:w-full"></div>
        </div>
        <div
          className="relative flex items-center justify-center w-40 h-40 overflow-hidden bg-white shadow-lg rounded-xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.320,1)] group cursor-pointer"
          onClick={() => openModal(<Settings />)}
        >
          <div className="flex flex-col items-center gap-2 text-gray-900 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.320,1)] group-hover:z-10 group-hover:text-white">
            <MdSettings className="text-3xl" />
            <p className="mt-2">설정</p>
          </div>
          <div className="absolute left-0 bottom-0 w-1 h-full bg-gradient-to-r from-[#4286f4] to-[#373b44] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.320,1)] group-hover:w-full"></div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {modalContent}
      </Modal>
    </div>
  );
};

export default MyPage;
