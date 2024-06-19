import PropTypes from 'prop-types';
import React from 'react';

export default function Label({
  children,
  optional = false,
  ...props
}) {
  return (
    <label
      className="inline-block mb-1 text-sm text-opacity-70"
      {...props}
    >
      {children}
      {!optional && <p className="ml-1.5 -translate-y-px text-red-500 text-sm">*</p>}
    </label>
  );
}

Label.propTypes = {
  children: PropTypes.node.isRequired,
  for: PropTypes.string.isRequired,
  optional: PropTypes.bool,
};
