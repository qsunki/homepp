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
import Modal from 'react-modal';
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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
    if (newMemberEmail.trim() === '' || newMemberNickname.trim() === '') return;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(newMemberEmail)) {
      setAlertMessage('유효한 이메일 주소를 입력해주세요.');
      setIsModalOpen(true);
      return;
    }

    try {
      const isEmailDuplicate = await checkDuplicateEmail(newMemberEmail);
      if (isEmailDuplicate) {
        setAlertMessage('가입되어 있지 않은 사용자입니다.');
        setIsModalOpen(true);
        return;
      }
      await addSharedMember(userEmail, {
        email: newMemberEmail,
        nickname: newMemberNickname,
      });
      setAlertMessage('공유 사용자가 추가되었습니다.');
      setIsModalOpen(true);
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

  const closeModal = () => {
    setIsModalOpen(false);
    setAlertMessage(null);
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
                className="border p-2 flex-grow mr-2 text-lg h-8"
              />
            ) : (
              <span className="text-lg">{member.nickname}</span>
            )}
            <div className="flex items-center">
              {editingMemberEmail === member.email ? (
                <>
                  <button
                    onClick={() => handleSaveMember(member.email)}
                    className="mr-2"
                  >
                    Save
                  </button>
                  <button onClick={() => setEditingMemberEmail(null)}>
                    Cancel
                  </button>
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
        <input
          type="text"
          placeholder="Email"
          value={newMemberEmail}
          onChange={(e) => setNewMemberEmail(e.target.value)}
          className="border p-2 flex-grow mr-2 text-lg h-8"
        />
        <input
          type="text"
          placeholder="Nickname"
          value={newMemberNickname}
          onChange={(e) => setNewMemberNickname(e.target.value)}
          className="border p-2 flex-grow mr-2 text-lg h-8"
        />
        <button
          onClick={handleAddMember}
          className="bg-blue-500 text-white p-2 rounded"
        >
          <FaPlus />
        </button>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Alert"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-content">
          <h2>{alertMessage}</h2>
          <button onClick={closeModal} className="modal-close-btn">
            확인
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CamSharingManagement;
