import { faUser } from '@fortawesome/pro-regular-svg-icons/faUser';
import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';
import React from 'react';
import Icon from './Icon';

export default function Avatar({
  border = false, alt, className, icon, src, size = 'sm', square = false,
}) {
  const getIconSize = React.useCallback(() => {
    if (size === 'xs') return 'xs';
    if (size === 'sm') return 'sm';
    if (size === 'md') return 'md';
    if (size === 'lg') return 'lg';
    if (size === 'xl') return '2x';
  }, [size]);

  const getImageSize = React.useCallback(() => {
    if (size === 'xs') return 24;
    if (size === 'sm') return 32;
    if (size === 'md') return 48;
    if (size === 'lg') return 64;
    if (size === 'xl') return 96;
    if (size === '2xl') return 128;
  }, [size]);

  const getBackgroundColor = React.useCallback(() => {
    if (src || !alt) return null;

    let hash = 0;
    for (let i = 0; i < alt.length; i++) {
      hash = alt.charCodeAt(i) + ((hash * 31) - hash);
    }

    return `hsl(${Math.abs(hash % 360)}, 80%, 50%)`;
  }, [alt, src]);

  return (
    <div
      className={clsx(
        className,
        square ? 'rounded' : 'rounded-full',
        'flex justify-center items-center overflow-hidden relative',
        { 'border border-gray-200 dark:border-gray-650': border || !(src || alt) },
        { 'w-6 h-6': size === 'xs' },
        { 'w-9 h-9': size === 'sm' },
        { 'w-12 h-12': size === 'md' },
        { 'w-16 h-16': size === 'lg' },
        { 'w-24 h-24': size === 'xl' },
        { 'w-32 h-32': size === '2xl' },
      )}
      style={{
        backgroundColor: getBackgroundColor(),
      }}
    >
      {src ? (
        <Image
          alt=""
          className="w-full h-full rounded-full"
          src={src}
          width={getImageSize()}
          height={getImageSize()}
        />
      ) : (
        <p className="text-white">
          {alt || <Icon icon={icon || faUser} size={getIconSize()} />}
        </p>
      )}
    </div>
  );
}

Avatar.propTypes = {
  border: PropTypes.bool,
  className: PropTypes.string,
  alt: PropTypes.string,
  icon: PropTypes.any,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  square: PropTypes.bool,
  src: PropTypes.string,
};
