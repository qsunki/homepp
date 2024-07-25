import React, { useState } from 'react';

interface PasswordInputProps {
  onPasswordVerify: (password: string) => void;
  errorMessage: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  onPasswordVerify,
  errorMessage,
}) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPasswordVerify(password);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        정보 수정을 위해 비밀번호를 입력해주세요
      </h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          className="border p-2 w-full mt-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
        />
        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        <button
          type="submit"
          className="mt-4 p-2 bg-blue-500 text-white w-full"
        >
          확인
        </button>
      </form>
    </div>
  );
};

export default PasswordInput;
