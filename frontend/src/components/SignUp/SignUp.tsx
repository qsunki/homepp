import React, { useState } from 'react';
import { CheckboxField } from './Checkbox';
import { useUserStore } from '../../store/userStore'; // Zustand 스토어 가져오기
import styles from './SignUp.module.css';
import backArrow from '../../asset/signup/backarrow.png';

interface SignUpProps {
  onClose: () => void;
}

export const SignUp: React.FC<SignUpProps> = ({ onClose }) => {
  const { checkboxes, setCheckboxes } = useUserStore();
  const [allChecked, setAllChecked] = useState(false);

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
    setCheckboxes({
      ...checkboxes,
      [name]: !checkboxes[name],
    });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <img className={styles.backArrow} alt="backArrow" src={backArrow} />
        </button>
        <div className={styles.formWrapper}>
          <p className={styles.title}>
            <span className={styles.titleHighlight}>Home++ </span>
            <br />
            <span className={styles.subtitle}>
              서비스 이용약관에 동의해주세요.
            </span>
          </p>
          <div className={styles.agreeAllWrapper}>
            <div className={styles.checkboxWithLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={allChecked}
                onChange={handleAllCheckedChange}
              />
              <p className={styles.label}>모두 동의 (선택 정보 포함)</p>
            </div>
          </div>

          <div className={styles.separator}>
            <div className={styles.line}></div>
          </div>

          <CheckboxField
            className={styles.checkboxItem}
            label="[필수] 개인정보 처리방침 동의 보기"
            checked={checkboxes.privacyPolicy}
            onChange={() => handleCheckboxChange('privacyPolicy')}
          />
          <CheckboxField
            className={styles.checkboxItem}
            label="[선택] 광고성 정보 수신 및 마케팅 활용 동의 보기"
            checked={checkboxes.marketing}
            onChange={() => handleCheckboxChange('marketing')}
          />
          <CheckboxField
            className={styles.checkboxItem}
            label="[필수] 만 14세 이상"
            checked={checkboxes.age}
            onChange={() => handleCheckboxChange('age')}
          />
          <CheckboxField
            className={styles.checkboxItem}
            label="[필수] 이용약관 동의 보기"
            checked={checkboxes.terms}
            onChange={() => handleCheckboxChange('terms')}
          />
          <button className={styles.submitButton}>제출</button>
        </div>
      </div>
    </div>
  );
};
