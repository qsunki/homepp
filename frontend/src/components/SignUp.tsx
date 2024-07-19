import React, { useEffect, useState } from 'react';
import { useUserStore } from 'store/useUserStore'; // Zustand 스토어 가져오기
import { useSignUpStore } from 'store/useSignUpStore'; // Zustand 스토어 가져오기
import backArrow from '../asset/signup/backarrow.png';

interface SignUpProps {
  onClose: () => void;
}

export const SignUp: React.FC<SignUpProps> = ({ onClose }) => {
  const { checkboxes, setCheckboxes } = useUserStore();
  const { step, nextStep, prevStep, resetSteps, height } = useSignUpStore();
  const [allChecked, setAllChecked] = useState(false);

  useEffect(() => {
    const allChecked =
      checkboxes.privacyPolicy &&
      checkboxes.marketing &&
      checkboxes.age &&
      checkboxes.terms;
    setAllChecked(allChecked);
  }, [checkboxes]);

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

  const handleClose = () => {
    if (step === 1) {
      setCheckboxes({
        privacyPolicy: false,
        marketing: false,
        age: false,
        terms: false,
      });
      setAllChecked(false);
      resetSteps();
      onClose();
    } else {
      prevStep();
    }
  };

  const handleFinalClose = () => {
    setCheckboxes({
      privacyPolicy: false,
      marketing: false,
      age: false,
      terms: false,
    });
    setAllChecked(false);
    resetSteps();
    onClose();
  };

  return (
    <div
      className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 bg-black bg-opacity-50"
      onClick={handleFinalClose}
    >
      <div
        className="bg-white p-8 rounded-lg relative w-96 shadow-lg"
        style={{ height }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="absolute top-2 left-2" onClick={handleClose}>
          <img className="w-6 h-6" alt="backArrow" src={backArrow} />
        </button>
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
            <button
              className="w-full bg-blue-600 text-white py-2 rounded mt-6"
              onClick={nextStep}
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
              />
            </div>
            <button
              className="w-full bg-blue-600 text-white py-2 rounded mt-6"
              onClick={nextStep}
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
              />
            </div>

            <button
              className="w-full bg-blue-600 text-white py-2 rounded mt-6"
              onClick={nextStep}
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
              />
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
              />
            </div>
            <button
              className="w-full bg-blue-600 text-white py-2 rounded mt-6"
              onClick={() => {
                // 회원가입 완료 처리 로직 추가
                alert('회원가입이 완료되었습니다.');
                handleFinalClose();
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
