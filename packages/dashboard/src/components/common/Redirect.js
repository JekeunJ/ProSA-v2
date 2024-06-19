import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import React from 'react';

export default function Redirect({ to }) {
  const router = useRouter();

  React.useEffect(() => {
    router.push(to);
  });

  return '';
}

Redirect.propTypes = {
  to: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      query: PropTypes.object,
    }),
  ]).isRequired,
};
