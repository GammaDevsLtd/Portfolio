"use client";
import React, { useState, useRef, useEffect } from 'react';
import styles from './Contact.module.css';
import { FaChevronDown } from 'react-icons/fa';

const CustomSelect = ({ options, value, onChange, name, placeholder, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  // This finds the label (e.g., "Website Development") from the value (e.g., "website")
  const getSelectedLabel = () => {
    const selectedOption = options.find(option => option.value === value);
    return selectedOption ? selectedOption.label : placeholder;
  };

  // This handles selecting an option - FIXED VERSION
  const handleSelect = (option) => {
    // Pass just the string value directly to the parent component
    // This matches what the API expects
    if (typeof onChange === 'function') {
      onChange(option.value);
    }
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
        className={`${styles.selectButton} ${disabled ? styles.disabled : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        tabIndex={disabled ? -1 : 0}
      >
        <span className={value ? styles.selectedValue : styles.selectPlaceholder}>
          {getSelectedLabel()}
        </span>
        <FaChevronDown
          className={`${styles.selectChevron} ${isOpen ? styles.open : ''} ${disabled ? styles.disabled : ''}`}
        />
      </div>

      {isOpen && !disabled && (
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