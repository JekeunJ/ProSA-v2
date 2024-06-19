import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

export default function Card({
  children, className, hoverable, color, ...props
}) {
  return (
    <div
      className={clsx(
        className,
        'relative bg-white dark:bg-gray-800 border shadow-sm',
        hoverable && 'transition hover:shadow',
        !className?.includes('rounded') && 'rounded-md',
        {
          'border-red-500': color === 'danger',
          'border-green-500': color === 'success',
          'border-yellow-500': color === 'warning',
        },
      )}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Header = function ({ children, className, ...props }) {
  return (
    <div className={clsx(className, 'py-4 px-5 bg-white dark:bg-gray-800 rounded-t-md')} {...props}>
      {children}
    </div>
  );
};

Card.Body = function ({ children, className, ...props }) {
  return (
    <div className={clsx(className, 'p-5 bg-white dark:bg-gray-800 first:rounded-t-md last:rounded-b-md')} {...props}>
      {children}
    </div>
  );
};

Card.Footer = function ({ children, className, ...props }) {
  return (
    <div className={clsx(className, 'py-4 px-5 bg-white dark:bg-gray-800 rounded-b-md')} {...props}>
      {children}
    </div>
  );
};

Card.Header.displayName = 'Card.Header';
Card.Body.displayName = 'Card.Body';
Card.Footer.displayName = 'Card.Footer';

Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  color: PropTypes.oneOf(['light', 'danger', 'success', 'warning']),
  hoverable: PropTypes.bool,
};

Card.defaultProps = {
  color: 'light',
};

Card.Header.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

Card.Body.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

Card.Footer.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
