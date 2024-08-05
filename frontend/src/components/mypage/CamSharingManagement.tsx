import React, { useState, useEffect } from 'react';
import {
  SharedMember,
  fetchSharedMembers,
  addSharedMember,
  updateSharedMember,
  deleteSharedMember,
  checkDuplicateEmail,
} from '../../api';
import { useUserStore } from '../../stores/useUserStore';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import checkIcon from '../../assets/mypage/check.png';
import cancelIcon from '../../assets/mypage/cancel.png';
import './CamSharingManagement.css';

const CamSharingManagement: React.FC = () => {
  const userEmail = useUserStore((state) => state.email);
  const [sharedMembers, setSharedMembers] = useState<SharedMember[]>([]);
  const [newMemberEmail, setNewMemberEmail] = useState<string>('');
  const [newMemberNickname, setNewMemberNickname] = useState<string>('');
  const [editingMemberEmail, setEditingMemberEmail] = useState<string | null>(
    null
  );
  const [editingMemberNickname, setEditingMemberNickname] =
    useState<string>('');
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadSharedMembers();
  }, []);

  const loadSharedMembers = async () => {
    try {
      const response = await fetchSharedMembers(userEmail);
      setSharedMembers(response.data);
    } catch (error) {
      console.error('공유 사용자 목록 불러오기 오류:', error);
    }
  };

  const handleAddMember = async () => {
    setAlertMessage(null);
    setSuccessMessage(null);

    if (newMemberEmail.trim() === '' || newMemberNickname.trim() === '') return;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(newMemberEmail)) {
      setAlertMessage('유효한 이메일 주소를 입력해주세요.');
      return;
    }

    if (sharedMembers.some((member) => member.email === newMemberEmail)) {
      setAlertMessage('이미 등록된 공유 사용자입니다.');
      return;
    }

    if (newMemberEmail === userEmail) {
      setAlertMessage('본인의 이메일은 추가할 수 없습니다.');
      return;
    }

    try {
      const isEmailDuplicate = await checkDuplicateEmail(newMemberEmail);
      if (isEmailDuplicate) {
        setAlertMessage('가입되어 있지 않은 사용자입니다.');
        return;
      }
      await addSharedMember(userEmail, {
        email: newMemberEmail,
        nickname: newMemberNickname,
      });
      setSuccessMessage('공유 사용자가 추가되었습니다.');
      loadSharedMembers();
      setNewMemberEmail('');
      setNewMemberNickname('');
    } catch (error) {
      console.error('공유 사용자 추가 오류:', error);
    }
  };

  const handleEditMember = (email: string, nickname: string) => {
    setEditingMemberEmail(email);
    setEditingMemberNickname(nickname);
  };

  const handleSaveMember = async (email: string) => {
    if (editingMemberNickname.trim() === '') return;
    try {
      const response = await updateSharedMember(
        userEmail,
        email,
        editingMemberNickname
      );
      const updatedMember = response.data;
      setSharedMembers((prevMembers) =>
        prevMembers.map((member) =>
          member.email === updatedMember.email ? updatedMember : member
        )
      );
      setEditingMemberEmail(null);
      setEditingMemberNickname('');
    } catch (error) {
      console.error('공유 사용자 수정 오류:', error);
    }
  };

  const handleDeleteMember = async (email: string) => {
    try {
      await deleteSharedMember(userEmail, email);
      loadSharedMembers();
    } catch (error) {
      console.error('공유 사용자 삭제 오류:', error);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    email: string
  ) => {
    if (e.key === 'Enter') {
      handleSaveMember(email);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Shared Member Management</h2>
      <ul className="list-disc pl-5 mb-4">
        {sharedMembers.map((member) => (
          <li
            key={member.email}
            className="flex justify-between items-center mb-4"
          >
            {editingMemberEmail === member.email ? (
              <input
                type="text"
                value={editingMemberNickname}
                onChange={(e) => setEditingMemberNickname(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, member.email)}
                className="border p-2 flex-grow mr-2 text-lg h-8"
              />
            ) : (
              <span className="text-lg">{member.nickname}</span>
            )}
            <div className="flex items-center">
              {editingMemberEmail === member.email ? (
                <>
                  <img
                    src={checkIcon}
                    alt="Save"
                    onClick={() => handleSaveMember(member.email)}
                    className="cursor-pointer mr-3 text-xl h-6 w-6"
                  />
                  <img
                    src={cancelIcon}
                    alt="Cancel"
                    onClick={() => setEditingMemberEmail(null)}
                    className="cursor-pointer text-xl h-6 w-6"
                  />
                </>
              ) : (
                <>
                  <FaEdit
                    onClick={() =>
                      handleEditMember(member.email, member.nickname)
                    }
                    className="text-blue-500 cursor-pointer mr-4 text-xl"
                  />
                  <FaTrash
                    onClick={() => handleDeleteMember(member.email)}
                    className="text-red-500 cursor-pointer text-xl"
                  />
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
      <div className="flex mb-4">
        <div className="input-group mr-2 flex-grow">
          <input
            type="text"
            required
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)}
            className="input"
          />
          <label className="user-label">Email</label>
        </div>
        <div className="input-group mr-2 flex-grow">
          <input
            type="text"
            required
            value={newMemberNickname}
            onChange={(e) => setNewMemberNickname(e.target.value)}
            className="input"
          />
          <label className="user-label">Nickname</label>
        </div>
        <button
          onClick={handleAddMember}
          className="bg-blue-500 text-white p-2 rounded"
        >
          <FaPlus />
        </button>
      </div>
      {alertMessage && (
        <div className="text-red-500 text-xs mb-4">{alertMessage}</div>
      )}
      {successMessage && (
        <div className="text-blue-500 text-xs mb-4">{successMessage}</div>
      )}
    </div>
  );
};

export default CamSharingManagement;
