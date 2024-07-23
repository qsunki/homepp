import React from 'react';
import fireIcon from '../../asset/filter/fire.png';
import soundIcon from '../../asset/filter/sound.png';
import thiefIcon from '../../asset/filter/thief.png';
import styles from './Filter.module.css';

interface FilterProps {
  selectedTypes: string[];
  onTypeToggle: (type: string) => void;
}

const Filter: React.FC<FilterProps> = ({ selectedTypes, onTypeToggle }) => {
  const icons = {
    fire: fireIcon,
    intrusion: thiefIcon,
    loud: soundIcon,
  };

  return (
    <div className="mb-4">
      <div className="flex flex-wrap">
        {Object.entries(icons).map(([type, icon]) => (
          <div
            key={type}
            className={`${styles.icon} ${
              selectedTypes.includes(type) ? styles.selected : ''
            } ${type}`}
            onClick={() => onTypeToggle(type)}
          >
            <span className={styles.tooltip}>{type}</span>
            <img src={icon} alt={type} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filter;
