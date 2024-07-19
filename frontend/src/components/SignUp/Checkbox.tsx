import React from 'react';
import styles from './Checkbox.module.css';

interface CheckboxFieldProps {
  className?: string;
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  className = '',
  label,
  checked,
  onChange,
}) => {
  return (
    <div className={`${styles.checkboxField} ${className}`}>
      <input
        type="checkbox"
        className={styles.checkbox}
        checked={checked}
        onChange={onChange}
      />
      <label className={styles.label}>{label}</label>
    </div>
  );
};
