"use client";
import React, { useState, useRef, useEffect } from 'react';
import styles from './FlexibleSelect.module.css';
import { FaChevronDown } from 'react-icons/fa';

const FlexibleSelect = ({ 
  options, 
  value, 
  onChange, 
  name, 
  placeholder = "Select an option",
  width = "100%", // Flexible width prop
  size = "medium", // small, medium, large
  variant = "default", // default, compact, inline
  className = "",
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const getSelectedLabel = () => {
    const selectedOption = options.find(option => option.value === value);
    return selectedOption ? selectedOption.label : placeholder;
  };

  const handleSelect = (option) => {
    const syntheticEvent = {
      target: {
        name: name,
        value: option.value,
      },
    };
    onChange(syntheticEvent);
    setIsOpen(false);
  };

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

  // Dynamic styles based on props
  const wrapperStyle = {
    width: width,
  };

  return (
    <div 
      className={`
        ${styles.flexibleSelectWrapper} 
        ${styles[size]} 
        ${styles[variant]}
        ${className}
        ${disabled ? styles.disabled : ''}
      `}
      style={wrapperStyle}
      ref={selectRef}
    >
      <div
        className={styles.selectButton}
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
          className={`${styles.selectChevron} ${isOpen ? styles.open : ''} ${
            disabled ? styles.disabledChevron : ''
          }`}
        />
      </div>

      {isOpen && (
        <ul className={styles.optionsMenu} role="listbox">
          {options.map((option) => (
            <li
              key={option.value}
              className={`${styles.optionItem} ${
                value === option.value ? styles.selected : ''
              } ${option.disabled ? styles.optionDisabled : ''}`}
              onClick={() => !option.disabled && handleSelect(option)}
              role="option"
              aria-selected={value === option.value}
              aria-disabled={option.disabled}
            >
              {option.icon && <span className={styles.optionIcon}>{option.icon}</span>}
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FlexibleSelect;