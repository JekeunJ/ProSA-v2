import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import Button from './Button';

export default function InputGroup({ children, className, ...props }) {
  return (
    <fieldset className={clsx(className, 'flex items-stretch input-group')} {...props}>
      {children}
    </fieldset>
  );
}

InputGroup.Text = function InputGroupText({ children, className }) {
  return (
    <span
      opacity={50}
      size="sm"
      className={clsx(
        'text-opacity-50 text-sm',
        className,
        'whitespace-nowrap inline-flex items-center px-3 border bg-gray-100 dark:bg-gray-800',
        'input-group:rounded-none input-group:first:rounded-l input-group:last:rounded-r input-group:-ml-px input-group:first:!ml-0',
      )}
    >
      {children}
    </span>
  );
};

InputGroup.Button = function InputGroupButton({ children, className, onClick }) {
  return (
    <Button
      size="md"
      onClick={onClick}
      className={clsx(
        className,
        'flex items-center px-3 border !border-gray-200 dark:!border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
        'input-group:rounded-none input-group:first:rounded-l input-group:last:rounded-r input-group:-ml-px input-group:first:!ml-0',
      )}
    >
      {children}
    </Button>
  );
};

InputGroup.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

InputGroup.Text.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

InputGroup.Button.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
};
