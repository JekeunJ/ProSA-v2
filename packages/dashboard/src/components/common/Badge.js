import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import Icon from './Icon';

export default function Badge({
  children,
  className,
  color,
  icon,
  size = 'sm',
  uppercase = false,
  ...props
}) {
  return (
    <div className="inline-block">
      <div
        className={clsx(
          className,
          'rounded whitespace-nowrap',
          { uppercase },
          {
            'px-1 py-px text-xs': size === 'xs',
            'px-1.5 py-px text-xs font-medium': size === 'sm',
            'px-2 py-0.5 text-xs font-medium': size === 'lg',
          },
          {
            'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600': color === 'gray',
            'bg-red-100 dark:bg-red-200 text-red-900 border border-red-200 dark:border-transparent': color === 'red',
            'bg-lime-100 dark:bg-lime-200 text-lime-900 border border-lime-400 dark:border-transparent': color === 'green',
            'bg-blue-100 dark:bg-blue-200 text-blue-900 border border-blue-200 dark:border-transparent': color === 'blue',
          },
        )}
        {...props}
      >
        {icon && <Icon icon={icon} className="mr-1.5" />}
        {children}
      </div>
    </div>
  );
}

Badge.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  color: PropTypes.string,
  icon: PropTypes.object,
  size: PropTypes.oneOf(['xs', 'sm', 'lg']),
  uppercase: PropTypes.bool,
};
