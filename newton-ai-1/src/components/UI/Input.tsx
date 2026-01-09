import React from 'react';

interface InputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const Input: React.FC<InputProps> = ({ type = 'text', placeholder, value, onChange, className }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
};

export default Input;