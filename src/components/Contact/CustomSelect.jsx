"use client";
import React, { useState, useRef, useEffect } from 'react';
import styles from './Contact.module.css'; // We'll use the same CSS module
import { FaChevronDown } from 'react-icons/fa'; // Import an icon

const CustomSelect = ({ options, value, onChange, name, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  // This finds the label (e.g., "Website Development") from the value (e.g., "website")
  const getSelectedLabel = () => {
    const selectedOption = options.find(option => option.value === value);
    return selectedOption ? selectedOption.label : placeholder;
  };

  // This handles selecting an option
  const handleSelect = (option) => {
    // We create a "synthetic event" to mimic the original <select>
    // This makes it 100% compatible with your existing handleChange function!
    const syntheticEvent = {
      target: {
        name: name,
        value: option.value,
      },
    };
    onChange(syntheticEvent); // Call the original handleChange
    setIsOpen(false); // Close the dropdown
  };

  // This closes the dropdown if you click outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.customSelectWrapper} ref={selectRef}>
      <div
        className={styles.selectButton}
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={value ? styles.selectedValue : styles.selectPlaceholder}>
          {getSelectedLabel()}
        </span>
        <FaChevronDown
          className={`${styles.selectChevron} ${isOpen ? styles.open : ''}`}
        />
      </div>

      {isOpen && (
        <ul className={styles.optionsMenu} role="listbox">
          {options.map((option) => (
            <li
              key={option.value}
              className={`${styles.optionItem} ${
                value === option.value ? styles.selected : ''
              }`}
              onClick={() => handleSelect(option)}
              role="option"
              aria-selected={value === option.value}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
