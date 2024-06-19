import clsx from 'clsx';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';
import Icon from './Icon';

const Link = React.forwardRef(({
  children,
  icon,
  href,
  onClick,
  scroll = false,
  color = false,
  underline = false,
  className,
  external = false,
  disabled = false,
  ...props
}, ref) => {
  return (
    <NextLink
      href={href}
      ref={ref}
      className={clsx(className, {
        'transition hover:underline text-blue-500 dark:text-blue-400': color,
        'inline-flex items-center': icon,
        'pointer-events-none': disabled,
        underline,
      })}
      {...props}
      target={external ? '_blank' : '_self'}
      scroll={scroll}
    >
      {children}
      {icon && <Icon icon={icon} className="ml-1.5" size="sm" />}
    </NextLink>
  );
});

Link.propTypes = {
  href: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  children: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.object,
  color: PropTypes.bool,
  external: PropTypes.bool,
  scroll: PropTypes.bool,
  underline: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default Link;
