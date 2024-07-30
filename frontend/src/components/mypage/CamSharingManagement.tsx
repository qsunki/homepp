import React, { useState, useEffect } from 'react';
import {
  getSharedMembers,
  addSharedMember,
  removeSharedMember,
  SharedMember,
} from '../../api';

const CamSharingManagement: React.FC = () => {
  const [contact, setContact] = useState('');
  const [sharedMembers, setSharedMembers] = useState<SharedMember[]>([]);
  const email = 'user@example.com'; // 예시 사용자 이메일

  useEffect(() => {
    fetchSharedMembers();
  }, []);

  const fetchSharedMembers = async () => {
    try {
      const response = await getSharedMembers(email);
      setSharedMembers(response.data);
    } catch (error) {
      console.error('Error fetching shared members:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContact(e.target.value);
  };

  const handleShareClick = async () => {
    try {
      const response = await addSharedMember(email, {
        nickname: 'Nickname',
        email: contact,
      });
      if (response.status === 200) {
        fetchSharedMembers();
        alert('공유 회원이 추가되었습니다.');
      } else {
        alert('공유 회원 추가에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error adding shared member:', error);
      alert('서버 오류가 발생했습니다.');
    }
  };

  const handleRemoveClick = async (sharedMemberEmail: string) => {
    try {
      const response = await removeSharedMember(email, sharedMemberEmail);
      if (response.status === 200) {
        fetchSharedMembers();
        alert('공유 회원이 삭제되었습니다.');
      } else {
        alert('공유 회원 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error removing shared member:', error);
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
      <ul>
        {sharedMembers.map((member) => (
          <li
            key={member.email}
            className="flex justify-between items-center mb-2"
          >
            <span>
              {member.nickname} ({member.email})
            </span>
            <button
              onClick={() => handleRemoveClick(member.email)}
              className="bg-red-500 text-white p-2 rounded"
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CamSharingManagement;
