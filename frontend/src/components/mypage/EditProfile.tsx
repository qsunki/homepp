import React, { useState, useEffect } from 'react';
import { useUserStore } from '../../stores/useUserStore';

interface EditProfileProps {
  onClose: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ onClose }) => {
  const email = useUserStore((state) => state.email);
  const phoneNumber = useUserStore((state) => state.phoneNumber);
  const setPhoneNumber = useUserStore((state) => state.setPhoneNumber);
  const setPassword = useUserStore((state) => state.setPassword);
  const [phone, setPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    setPhone(phoneNumber);
  }, [phoneNumber]);

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    let formattedValue = value;

    if (value.length > 3 && value.length <= 7) {
      formattedValue = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else if (value.length > 7) {
      formattedValue = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(
        7,
        11
      )}`;
    }

    setPhone(formattedValue);

    if (!formattedValue.startsWith('010')) {
      setPhoneError('Phone number must start with 010');
    } else if (value.length === 11) {
      setPhoneError('');
    } else {
      setPhoneError('Phone number must be 11 digits');
    }
  };

  const validatePassword = () => {
    const hasLetter = /[a-zA-Z]/.test(newPassword);
    const hasNumber = /\d/.test(newPassword);
    const length = newPassword.length >= 8 && newPassword.length <= 20;

    return { hasLetter, hasNumber, length };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone.startsWith('010') || phone.replace(/\D/g, '').length !== 11) {
      setPhoneError('Phone number must start with 010 and be 11 digits');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    const { hasLetter, hasNumber, length } = validatePassword();
    if (newPassword && (!hasLetter || !hasNumber || !length)) {
      setPasswordError(
        'Password must include letters, numbers, and be 8-20 characters long'
      );
      return;
    }

    if (!newPassword) {
      setPasswordError('');
    } else {
      setPasswordError('');
      setPassword(newPassword);
    }

    setPhoneNumber(phone);
    alert('Profile updated successfully');
    onClose();
  };

  const passwordValidations = validatePassword();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input
            type="text"
            className="border p-2 w-full bg-gray-200 cursor-not-allowed"
            value={email}
            readOnly
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Phone Number</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={phone}
            onChange={handlePhoneNumberChange}
          />
          {phoneError && (
            <p className="text-red-500 text-sm mt-1">{phoneError}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-2">New Password</label>
          <input
            type="password"
            className="border p-2 w-full"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <div className="flex text-xs mt-1 space-x-4">
            <div
              className={
                passwordValidations.hasLetter
                  ? 'text-blue-600'
                  : 'text-gray-500'
              }
            >
              영문포함 ✔
            </div>
            <div
              className={
                passwordValidations.hasNumber
                  ? 'text-blue-600'
                  : 'text-gray-500'
              }
            >
              숫자포함 ✔
            </div>
            <div
              className={
                passwordValidations.length ? 'text-blue-600' : 'text-gray-500'
              }
            >
              8~20자 이내 ✔
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Confirm New Password</label>
          <input
            type="password"
            className="border p-2 w-full"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {passwordError && (
          <p className="text-red-500 text-sm mt-1">{passwordError}</p>
        )}
        <button
          type="submit"
          className="mt-4 p-2 bg-blue-500 text-white w-full"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
