import React, { useState } from 'react';
// import messaging from '../../firebase';

const CamSharingManagement: React.FC = () => {
  const [contact, setContact] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContact(e.target.value);
  };

  const handleShareClick = async () => {
    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contact }),
      });
      if (response.ok) {
        alert('FCM을 통해 공유 링크가 전송되었습니다.');
      } else {
        alert('공유 링크 전송에 실패했습니다.');
      }
    } catch (error) {
      alert('서버 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Cam Sharing</h2>
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={contact}
          onChange={handleInputChange}
          placeholder="이메일을 입력하세요"
          className="border p-2 flex-grow"
        />
        <button
          onClick={handleShareClick}
          className="bg-blue-500 text-white p-2 ml-4 rounded"
        >
          공유
        </button>
      </div>
    </div>
  );
};

export default CamSharingManagement;
