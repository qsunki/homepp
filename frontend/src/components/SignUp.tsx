import React, { useState, useEffect, FormEvent } from 'react';
import { useUserStore } from '../stores/useUserStore';
import { registerUser, checkDuplicateEmail, checkDuplicatePhoneNumber } from '../api'; // 추가
import backArrow from '../assets/signup/backarrow.png';
import axios from 'axios';

interface SignUpProps {
  onClose: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onClose }) => {
  const {
    phoneNumber,
    email,
    password,
    setPhoneNumber,
    setEmail,
    setPassword,
    checkboxes,
    setCheckboxes,
  } = useUserStore();
  const [step, setStep] = useState(1);
  const [allChecked, setAllChecked] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    hasNumber: false,
    hasLetter: false,
  });

  useEffect(() => {
    const allChecked =
      checkboxes.privacyPolicy &&
      checkboxes.marketing &&
      checkboxes.age &&
      checkboxes.terms;
    setAllChecked(allChecked);
  }, [checkboxes]);

  useEffect(() => {
    const length = password.length >= 8 && password.length <= 20;
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    setPasswordValidations({ length, hasNumber, hasLetter });
  }, [password]);

  const handleAllCheckedChange = () => {
    const newCheckedState = !allChecked;
    setAllChecked(newCheckedState);
    setCheckboxes({
      privacyPolicy: newCheckedState,
      marketing: newCheckedState,
      age: newCheckedState,
      terms: newCheckedState,
    });
  };

  const handleCheckboxChange = (name: keyof typeof checkboxes) => {
    const newCheckboxes = { ...checkboxes, [name]: !checkboxes[name] };
    setCheckboxes(newCheckboxes);

    const allChecked =
      newCheckboxes.privacyPolicy &&
      newCheckboxes.marketing &&
      newCheckboxes.age &&
      newCheckboxes.terms;
    setAllChecked(allChecked);
  };

  const resetPopup = () => {
    setCheckboxes({
      privacyPolicy: false,
      marketing: false,
      age: false,
      terms: false,
    });
    setAllChecked(false);
    setStep(1);
    setPhoneNumber('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrorMessage('');
  };

  const handleClose = () => {
    resetPopup();
    onClose();
  };

  const handleBack = () => {
    if (step === 1) {
      handleClose();
    } else {
      setStep((prevStep) => prevStep - 1);
    }
  };

  const handleNextStep = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    if (step === 1) {
      if (!checkboxes.age || !checkboxes.terms || !checkboxes.privacyPolicy) {
        setErrorMessage('필수항목에 모두 동의해주세요.');
        return;
      }
    } else if (step === 2) {
      if (
        !phoneNumber.startsWith('010') ||
        phoneNumber.replace(/-/g, '').length !== 11
      ) {
        setErrorMessage('휴대폰 번호를 확인해주세요.');
        return;
      }

      // 중복 전화번호 확인
      try {
        const isDuplicate = await checkDuplicatePhoneNumber(phoneNumber);
        if (isDuplicate) {
          setErrorMessage('이미 사용 중인 휴대폰 번호입니다.');
          return;
        }
      } catch (error) {
        setErrorMessage('휴대폰 번호 확인 중 오류가 발생했습니다.');
        return;
      }
    } else if (step === 3) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        setErrorMessage('이메일을 확인해주세요.');
        return;
      }

      // 중복 이메일 확인
      try {
        const isDuplicate = await checkDuplicateEmail(email);
        if (isDuplicate) {
          setErrorMessage('이미 사용 중인 이메일입니다.');
          return;
        }
      } catch (error) {
        setErrorMessage('이메일 확인 중 오류가 발생했습니다.');
        return;
      }
    } else if (step === 4) {
      if (password !== confirmPassword) {
        setErrorMessage('비밀번호를 확인해주세요.');
        return;
      }
      if (
        !passwordValidations.length ||
        !passwordValidations.hasNumber ||
        !passwordValidations.hasLetter
      ) {
        setErrorMessage('비밀번호가 조건을 충족하지 않습니다.');
        return;
      }
      try {
        await registerUser({ email, phoneNumber, password });
        alert('회원가입이 완료되었습니다.');
        handleClose(); // 회원가입 완료 후 팝업 닫기
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(
            '회원가입 오류:',
            error.response ? error.response.data : error.message
          );
        } else {
          console.error('회원가입 오류:', error);
        }
        setErrorMessage('회원가입 오류가 발생했습니다.');
      }
    }
    setStep((prevStep) => prevStep + 1);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // 숫자가 아닌 문자는 제거
    let formattedValue = value;

    if (value.length > 3 && value.length <= 7) {
      formattedValue = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else if (value.length > 7) {
      formattedValue = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(
        7,
        11
      )}`;
    }

    setPhoneNumber(formattedValue);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    action: () => void
  ) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  const ProgressBar = () => {
    const steps = ['Step 1', 'Step 2', 'Step 3', 'Step 4'];
    return (
      <div className="flex items-center justify-center mb-8">
        {steps.map((label, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`flex items-center justify-center w-6 h-6 text-sm rounded-full border-2 ${
                index + 1 <= step
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-gray-300 bg-white text-gray-300'
              }`}
            >
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-12 h-1 ${
                  index + 1 < step ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 bg-black bg-opacity-50">
      <div
        className="bg-white p-8 rounded-lg relative w-96 shadow-lg"
        onClick={(e) => e.stopPropagation()}
        style={{ height: 550 }}
      >
        <button className="absolute top-3 left-3" onClick={handleBack}>
          <img className="w-6 h-6" alt="backArrow" src={backArrow} />
        </button>
        <ProgressBar />
        <form onSubmit={handleNextStep}>
          {step === 1 && (
            <>
              <div className="text-center mb-8">
                <p className="text-4xl font-bold">
                  <span className="block">Home++</span>
                  <span className="block text-xl mt-2">
                    서비스 이용약관에 동의해주세요.
                  </span>
                </p>
              </div>
              <div className="mb-4">
                <label className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={allChecked}
                    onChange={handleAllCheckedChange}
                  />
                  <span className="text-sm">모두 동의 (선택 정보 포함)</span>
                </label>
              </div>

              <div className="border-b mb-4"></div>

              <label className="flex items-center mb-2">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={checkboxes.age}
                  onChange={() => handleCheckboxChange('age')}
                />
                <span className="text-sm">[필수] 만 14세 이상</span>
              </label>
              <label className="flex items-center mb-2">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={checkboxes.terms}
                  onChange={() => handleCheckboxChange('terms')}
                />
                <span className="text-sm">[필수] 이용약관 동의 보기</span>
              </label>
              <label className="flex items-center mb-2">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={checkboxes.privacyPolicy}
                  onChange={() => handleCheckboxChange('privacyPolicy')}
                />
                <span className="text-sm">
                  [필수] 개인정보 처리방침 동의 보기
                </span>
              </label>
              <label className="flex items-center mb-2">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={checkboxes.marketing}
                  onChange={() => handleCheckboxChange('marketing')}
                />
                <span className="text-sm">
                  [선택] 광고성 정보 수신 및 마케팅 활용 동의 보기
                </span>
              </label>
              {errorMessage && (
                <div className="text-red-500 text-xs mb-4">{errorMessage}</div>
              )}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded mt-6"
              >
                동의하고 가입하기
              </button>
            </>
          )}
          {step === 2 && (
            <>
              <div className="text-center mb-8">
                <p className="text-4xl font-bold">
                  <span className="block text-xl mt-2">
                    가입을 위한
                    <br />
                    휴대폰 번호를 입력해주세요.
                  </span>
                </p>
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm" htmlFor="phoneNumber">
                  휴대폰 번호
                </label>
                <input
                  id="phoneNumber"
                  type="text"
                  className="border rounded w-full py-2 px-3"
                  placeholder="휴대폰 번호"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  onKeyDown={(e) =>
                    handleKeyDown(e, () =>
                      handleNextStep(e as unknown as FormEvent<HTMLFormElement>)
                    )
                  }
                />
                {errorMessage && (
                  <div className="text-red-500 text-xs mb-4">
                    {errorMessage}
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded mt-6"
              >
                다음
              </button>
            </>
          )}
          {step === 3 && (
            <>
              <div className="text-center mb-8">
                <p className="text-4xl font-bold">
                  <span className="block text-xl mt-2">
                    로그인에 사용할
                    <br />
                    이메일을 입력해주세요.
                  </span>
                </p>
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm" htmlFor="email">
                  이메일
                </label>
                <input
                  id="email"
                  type="email"
                  className="border rounded w-full py-2 px-3"
                  placeholder="이메일"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) =>
                    handleKeyDown(e, () =>
                      handleNextStep(e as unknown as FormEvent<HTMLFormElement>)
                    )
                  }
                />
                {errorMessage && (
                  <div className="text-red-500 text-xs mb-4">
                    {errorMessage}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded mt-6"
              >
                다음
              </button>
            </>
          )}
          {step === 4 && (
            <>
              <div className="text-center mb-8">
                <p className="text-4xl font-bold">
                  <span className="block text-xl mt-2">
                    로그인에 사용할
                    <br />
                    비밀번호를 설정해주세요.
                  </span>
                </p>
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm" htmlFor="password">
                  비밀번호
                </label>
                <input
                  id="password"
                  type="password"
                  className="border rounded w-full py-2 px-3"
                  placeholder="비밀번호"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) =>
                    handleKeyDown(e, () =>
                      handleNextStep(e as unknown as FormEvent<HTMLFormElement>)
                    )
                  }
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
                      passwordValidations.length
                        ? 'text-blue-600'
                        : 'text-gray-500'
                    }
                  >
                    8~20자 이내 ✔
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm" htmlFor="confirmPassword">
                  비밀번호 확인
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  className="border rounded w-full py-2 px-3"
                  placeholder="비밀번호 확인"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={(e) =>
                    handleKeyDown(e, () =>
                      handleNextStep(e as unknown as FormEvent<HTMLFormElement>)
                    )
                  }
                />
              </div>
              {errorMessage && (
                <div className="text-red-500 text-xs mb-4">{errorMessage}</div>
              )}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded mt-6"
              >
                완료
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignUp;
