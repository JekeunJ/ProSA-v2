import { faSpinner } from '@fortawesome/pro-regular-svg-icons';
import clsx from 'clsx';
import Color from 'color';
import PropTypes from 'prop-types';
import React from 'react';
import Icon from './Icon';

export default function Button({
  children,
  className,
  type = 'button',
  size = 'sm',
  icon,
  prefix,
  suffix,
  variant = 'light',
  color,
  as: Tag = 'button',
  disabled = false,
  onClick,
  loading = false,
  shimmer = false,
  shortcut,
  ...props
}) {
  if (loading) icon = faSpinner;
  if (color) variant = null;

  return (
    <Tag
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        className,
        {
          'cursor-not-allowed': disabled,
          'cursor-default pointer-events-none': loading,
          'overflow-hidden after:left-[-300%] after:content-[""] after:w-[300%] after:h-full after:animate-shimmer': shimmer,
        },
        {
          'px-2.5 h-7 text-sm': size === 'xs',
          'px-3 h-8 text-sm': size === 'sm',
          'px-3 h-9 text-sm': size === 'md',
          'px-3 h-10 ': size === 'lg',
          'px-5 h-11 ': size === 'xl',
        },
        { 'rounded-md': !className?.includes('rounded') },
        (disabled || loading) ? 'text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-800 border' : {
          'after:bg-gradient-to-r after:from-transparent after:to-transparent': shimmer,
          'text-gray-800 dark:text-white bg-white dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 after:via-gray-100 dark:after:via-gray-500': variant === 'light',
          'text-white dark:text-black bg-gray-800 dark:bg-gray-100 hover:bg-gray-700 dark:hover:bg-white border border-transparent after:via-gray-600 dark:after:via-white': variant === 'dark',
          'text-white bg-red-600 hover:bg-red-700 border border-transparent after:via-red-400': variant === 'danger',
          'focus:outline-none shadow-sm hover:shadow focus:shadow active:shadow-none': variant || color,
        },
        'box-border relative after:absolute inline-flex items-center align-middle min-w-min select-none outline-none justify-center text-center whitespace-nowrap transition appearance-none focus:outline-none font-medium',
      )}
      style={!color || disabled || loading ? {} : {
        backgroundColor: color,
        color: Color(color).luminosity() > 0.4 ? 'black' : 'white',
      }}
      {...props}
    >
      {icon && <Icon icon={icon} className={clsx({ 'animate-spin': loading, 'mr-2': !!children })} />}
      {prefix && !loading && <div className="mr-2">{prefix}</div>}
      {children}
      {suffix && <div className="ml-2">{suffix}</div>}
      {shortcut && (
        <kbd className="font-sans hidden sm:inline-block rounded px-1 text-xs bg-gray-400 bg-opacity-40 ml-2">
          {shortcut}
        </kbd>
      )}
    </Tag>
  );
}

Button.propTypes = {
  as: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
    PropTypes.shape({ $$typeof: PropTypes.symbol, render: PropTypes.func }),
    PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.string,
      PropTypes.shape({ $$typeof: PropTypes.symbol, render: PropTypes.func }),
    ])),
  ]),
  children: PropTypes.node,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  className: PropTypes.string,
  color: PropTypes.string,
  variant: PropTypes.oneOf(['light', 'dark', 'danger']),
  disabled: PropTypes.bool,
  icon: PropTypes.object,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
  shimmer: PropTypes.bool,
  shortcut: PropTypes.string,
  size: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
};
