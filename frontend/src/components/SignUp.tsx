import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useUserStore } from '../stores/useUserStore';
import { registerUser, checkEmailExists, checkPhoneNumberExists } from '../api';
import backArrow from '../assets/signup/backarrow.png';

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
    login,
    checkboxes,
    setCheckboxes,
  } = useUserStore();

  const [step, setStep] = useState(1);

  // 로컬 상태를 정의합니다.
  const [allChecked, setAllChecked] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [phoneNumberErrorMessage, setPhoneNumberErrorMessage] = useState('');

  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    hasNumber: false,
    hasLetter: false,
  });

  // 모든 체크박스가 체크되어 있는지 확인합니다.
  useEffect(() => {
    const allChecked =
      checkboxes.privacyPolicy &&
      checkboxes.marketing &&
      checkboxes.age &&
      checkboxes.terms;
    setAllChecked(allChecked);
  }, [checkboxes]);

  // 비밀번호 조건을 확인합니다.
  useEffect(() => {
    const length = password.length >= 8 && password.length <= 20;
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    setPasswordValidations({
      length,
      hasNumber,
      hasLetter,
    });
  }, [password]);

  // "모두 동의" 체크박스를 변경합니다.
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

  // 개별 체크박스를 변경합니다.
  const handleCheckboxChange = (name: keyof typeof checkboxes) => {
    const newCheckboxes = {
      ...checkboxes,
      [name]: !checkboxes[name],
    };
    setCheckboxes(newCheckboxes);

    const allChecked =
      newCheckboxes.privacyPolicy &&
      newCheckboxes.marketing &&
      newCheckboxes.age &&
      newCheckboxes.terms;
    setAllChecked(allChecked);
  };

  // 팝업을 초기화하는 함수입니다.
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
    setEmailErrorMessage('');
    setPhoneNumberErrorMessage('');
  };

  // 팝업을 닫습니다.
  const handleClose = () => {
    resetPopup();
    onClose();
  };

  // 이전 단계로 돌아갑니다.
  const handleBack = () => {
    if (step === 1) {
      handleClose();
    } else {
      setStep((prevStep) => prevStep - 1);
    }
  };

  // 다음 단계로 넘어갑니다.
  const handleNextStep = async () => {
    setErrorMessage('');
    setEmailErrorMessage('');
    setPhoneNumberErrorMessage('');
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

      try {
        const response = await checkPhoneNumberExists(phoneNumber);
        if (response.data.exists) {
          setPhoneNumberErrorMessage('이미 존재하는 휴대폰 번호입니다.');
          return;
        }
      } catch (error) {
        console.error('전화번호 중복 확인 오류:', error);
        setPhoneNumberErrorMessage('전화번호 중복 확인 오류가 발생했습니다.');
        return;
      }
    } else if (step === 3) {
      // 이메일 형식 검증
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        setErrorMessage('이메일을 확인해주세요.');
        return;
      }

      try {
        const response = await checkEmailExists(email);
        if (response.data.exists) {
          setEmailErrorMessage('이미 존재하는 이메일입니다.');
          return;
        }
      } catch (error) {
        console.error('이메일 중복 확인 오류:', error);
        setEmailErrorMessage('이메일 중복 확인 오류가 발생했습니다.');
        return;
      }
    }
    setStep((prevStep) => prevStep + 1);
  };

  // 휴대폰 번호 입력 시 형식을 적용합니다.
  const handlePhoneNumberChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
    setPhoneNumberErrorMessage('');

    if (formattedValue.length === 13) {
      try {
        const response = await checkPhoneNumberExists(formattedValue);
        if (response.data.exists) {
          setPhoneNumberErrorMessage('이미 존재하는 휴대폰 번호입니다.');
        }
      } catch (error) {
        console.error('전화번호 중복 확인 오류:', error);
        setPhoneNumberErrorMessage('전화번호 중복 확인 오류가 발생했습니다.');
      }
    }
  };

  // 이메일 입력 시 중복 여부를 확인합니다.
  const handleEmailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailErrorMessage('');
    try {
      const response = await checkEmailExists(e.target.value);
      if (response.data.exists) {
        setEmailErrorMessage('이미 존재하는 이메일입니다.');
      }
    } catch (error) {
      console.error('이메일 중복 확인 오류:', error);
      setEmailErrorMessage('이메일 중복 확인 오류가 발생했습니다.');
    }
  };

  // Enter 키를 눌렀을 때 버튼을 클릭하는 함수입니다.
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    action: () => void
  ) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  // Progress Bar 컴포넌트를 정의합니다.
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
    <div
      className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 bg-black bg-opacity-50"
      onClick={resetPopup}
    >
      <div
        className="bg-white p-8 rounded-lg relative w-96 shadow-lg"
        onClick={(e) => e.stopPropagation()}
        style={{ height: 550 }} // 높이를 550px로 설정
      >
        <button className="absolute top-3 left-3" onClick={handleBack}>
          <img className="w-6 h-6" alt="backArrow" src={backArrow} />
        </button>
        <ProgressBar />
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
              className="w-full bg-blue-600 text-white py-2 rounded mt-6"
              onClick={handleNextStep}
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
                onKeyDown={(e) => handleKeyDown(e, handleNextStep)}
              />
              {phoneNumberErrorMessage && (
                <div className="text-red-500 text-xs mb-4">
                  {phoneNumberErrorMessage}
                </div>
              )}
            </div>
            <button
              className="w-full bg-blue-600 text-white py-2 rounded mt-6"
              onClick={handleNextStep}
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
                onChange={handleEmailChange}
                onKeyDown={(e) => handleKeyDown(e, handleNextStep)}
              />
              {emailErrorMessage && (
                <div className="text-red-500 text-xs mb-4">
                  {emailErrorMessage}
                </div>
              )}
            </div>

            <button
              className="w-full bg-blue-600 text-white py-2 rounded mt-6"
              onClick={handleNextStep}
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
                  handleKeyDown(e, async () => {
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
                      // 회원가입 API 호출
                      const response = await registerUser({
                        email,
                        phoneNumber,
                        password,
                      });
                      console.log('회원가입 성공:', response.data); // 콘솔에 로그 추가
                      alert('회원가입이 완료되었습니다.');
                      if (response.data.userId) {
                        login(
                          response.data.userId,
                          response.data.phoneNumber,
                          response.data.email,
                          response.data.password
                        );
                        resetPopup();
                        onClose();
                      } else {
                        setErrorMessage('회원가입에 실패했습니다.');
                      }
                    } catch (error) {
                      if (
                        axios.isAxiosError(error) &&
                        error.response?.status === 409
                      ) {
                        setErrorMessage(
                          '이미 존재하는 이메일 또는 휴대폰 번호입니다.'
                        );
                      } else if (error instanceof Error && error.message) {
                        console.error('회원가입 오류:', error.message); // 콘솔에 오류 로그 추가
                        setErrorMessage(error.message);
                      } else {
                        console.error('회원가입 오류:', error); // 콘솔에 오류 로그 추가
                        setErrorMessage('회원가입 오류가 발생했습니다.');
                      }
                    }
                  })
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
                  handleKeyDown(e, async () => {
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
                      // 회원가입 API 호출
                      const response = await registerUser({
                        email,
                        phoneNumber,
                        password,
                      });
                      console.log('회원가입 성공:', response.data); // 콘솔에 로그 추가
                      alert('회원가입이 완료되었습니다.');
                      if (response.data.userId) {
                        login(
                          response.data.userId,
                          response.data.phoneNumber,
                          response.data.email,
                          response.data.password
                        );
                        resetPopup();
                        onClose();
                      } else {
                        setErrorMessage('회원가입에 실패했습니다.');
                      }
                    } catch (error) {
                      if (
                        axios.isAxiosError(error) &&
                        error.response?.status === 409
                      ) {
                        setErrorMessage(
                          '이미 존재하는 이메일 또는 휴대폰 번호입니다.'
                        );
                      } else if (error instanceof Error && error.message) {
                        console.error('회원가입 오류:', error.message); // 콘솔에 오류 로그 추가
                        setErrorMessage(error.message);
                      } else {
                        console.error('회원가입 오류:', error); // 콘솔에 오류 로그 추가
                        setErrorMessage('회원가입 오류가 발생했습니다.');
                      }
                    }
                  })
                }
              />
            </div>
            {errorMessage && (
              <div className="text-red-500 text-xs mb-4">{errorMessage}</div>
            )}
            <button
              className="w-full bg-blue-600 text-white py-2 rounded mt-6"
              onClick={async () => {
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
                  // 회원가입 API 호출
                  const response = await registerUser({
                    email,
                    phoneNumber,
                    password,
                  });
                  console.log('회원가입 성공:', response.data); // 콘솔에 로그 추가
                  alert('회원가입이 완료되었습니다.');
                  if (response.data.userId) {
                    login(
                      response.data.userId,
                      response.data.phoneNumber,
                      response.data.email,
                      response.data.password
                    );
                    resetPopup();
                    onClose();
                  } else {
                    setErrorMessage('회원가입에 실패했습니다.');
                  }
                } catch (error) {
                  if (
                    axios.isAxiosError(error) &&
                    error.response?.status === 409
                  ) {
                    setErrorMessage(
                      '이미 존재하는 이메일 또는 휴대폰 번호입니다.'
                    );
                  } else if (error instanceof Error && error.message) {
                    console.error('회원가입 오류:', error.message); // 콘솔에 오류 로그 추가
                    setErrorMessage(error.message);
                  } else {
                    console.error('회원가입 오류:', error); // 콘솔에 오류 로그 추가
                    setErrorMessage('회원가입 오류가 발생했습니다.');
                  }
                }
              }}
            >
              완료
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SignUp;
