import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

export default function Input({
  className,
  copyable = false,
  disabled = false,
  invalid = false,
  name,
  readOnly,
  size = 'md',
  width,
  ...props
}) {
  return (
    <input
      name={name}
      id={name}
      disabled={disabled}
      type="text"
      onClick={copyable ? (e) => {
        e.preventDefault();
        e.target.select();
      } : undefined}
      readOnly={readOnly || copyable}
      autoComplete="off"
      spellCheck="false"
      autoCorrect="off"
      style={{ width }}
      className={clsx(
        className,
        'relative transition focus:!ring focus-within:z-20 bg-white dark:bg-gray-900 placeholder-gray-300 dark:placeholder-gray-500 text-gray-800 dark:text-white py-0 px-3 w-full disabled:cursor-not-allowed',
        {
          'h-7 text-sm': size === 'xs',
          'h-8 text-sm': size === 'sm',
          'h-9 text-sm': size === 'md',
          'h-10': size === 'lg',
          'h-11': size === 'xl',
        },
        { 'rounded-md input-group:rounded-none input-group:first:rounded-l-md input-group:last:rounded-r-md': !className?.includes('rounded') },
        { 'input-group:-ml-px input-group:first:!ml-0': !className?.includes('input-group') },
        {
          '!border-gray-200 dark:!border-gray-700 focus:!border-blue-300 dark:focus:!border-blue-400 !ring-blue-400 !ring-opacity-40': !invalid,
          '!border-red-500 !ring-red-400 !ring-opacity-40 z-10': invalid,
        },
      )}
      {...props}
    />
  );
}

Input.propTypes = {
  className: PropTypes.string,
  copyable: PropTypes.bool,
  disabled: PropTypes.bool,
  invalid: PropTypes.bool,
  name: PropTypes.string.isRequired,
  readOnly: PropTypes.bool,
  size: PropTypes.string,
  width: PropTypes.number,
};
