import { ChevronDownIcon } from '@primer/octicons-react';
import React, { useState, useEffect, useRef, CSSProperties } from 'react';

interface Option {
  label: string;
  value: string;
}

interface DropdownProps {
  options: Option[];
  onSelect: (option: Option) => void;
  placeholder?: string;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  initialValue?: Option;
  style?: CSSProperties;
  className?: string;
  labelClassName?: string;
  isSearchable?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  onSelect,
  placeholder = 'Select an option',
  size = 'medium',
  disabled = false,
  initialValue = null,
  style,
  className,
  labelClassName,
  isSearchable = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(
    initialValue
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [maxHeight, setMaxHeight] = useState('0px');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialValue) {
      setSelectedOption(initialValue);
    }
  }, [initialValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setMaxHeight('0px');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      const newMaxHeight = isOpen
        ? '0px'
        : `${Math.min(options.length * 180)}px`;
      setMaxHeight(newMaxHeight);
    }
  };

  const handleSelect = (option: Option) => {
    if (!disabled) {
      setSelectedOption(option);
      onSelect(option);
      setIsOpen(false);
      setSearchTerm('');
      setMaxHeight('0px');
    }
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sizeClass =
    size === 'small' ? 'w-32' : size === 'large' ? 'w-64' : 'w-48';

  return (
    <div
      ref={dropdownRef}
      className={`relative inline-block text-left  ${sizeClass} ${className}`}
      style={style}
    >
      <button
        onClick={handleToggle}
        className={`inline-flex items-center gap-2 font-monserat justify-left ${sizeClass} rounded-md border border-[#DDDDDD] px-5 py-3 bg-[#F9F9F9] text-sm font-medium text-gray-700 hover:bg-gray-50 ${
          disabled ? 'cursor-not-allowed opacity-50' : ''
        }`}
        disabled={disabled}
      >
        <span
          className={`${
            !selectedOption ? 'text-gray-400' : ''
          } ${labelClassName}`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDownIcon className="ml-auto" />
      </button>
      <div
        className={`absolute z-50 mt-2 transition-all duration-300 ease-in-out ${sizeClass} rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        style={{
          maxHeight: maxHeight,
          transition:
            'max-height 0.3s ease, opacity 0.3s ease, visibility 0.3s ease',
        }}
      >
        {isSearchable && (
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 font-medium py-2 text-sm rounded-t-md border-b border-gray-300 focus:outline-none"
            placeholder="Search..."
          />
        )}
        <ul className="max-h-60 overflow-auto px-2 py-2">
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              onClick={() => handleSelect(option)}
              className="cursor-pointer select-none py-2 px-3 font-medium text-sm relative rounded-md hover:bg-gray-100 hover:text-dark"
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dropdown;
