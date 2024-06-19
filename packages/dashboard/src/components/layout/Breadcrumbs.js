import PropTypes from 'prop-types';
import React from 'react';
import Link from '../common/Link';

function Breadcrumb({ children, href, ...props }) {
  return (
    <Link href={href} {...props} className="rounded px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700">
      <p className="overflow-hidden max-w-xs text-sm opacity-70 font-medium truncate">
        {children}
      </p>
    </Link>
  );
}

Breadcrumb.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
};

export default function Breadcrumbs({ stops }) {
  return (
    <div className="flex items-center space-x-1">
      {stops.map((stop) => (
        <React.Fragment key={stop.path || stop}>
          <span className="select-none opacity-30">/</span>
          <Breadcrumb href={stop.path}>
            {stop.text}
          </Breadcrumb>
        </React.Fragment>
      ))}
    </div>
  );
}

Breadcrumbs.propTypes = {
  stops: PropTypes.arrayOf(PropTypes.shape({
    path: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  })).isRequired,
};
