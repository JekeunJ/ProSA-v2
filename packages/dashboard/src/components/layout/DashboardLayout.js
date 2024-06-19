import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import React from 'react';
import useUser from '../../hooks/useUser';
import Redirect from '../common/Redirect';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const user = useUser();

  if (user.error?.response.status === 401) {
    document.cookie = 'authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    return <Redirect to={{ pathname: '/login', query: { redirect: router.asPath } }} />;
  }

  // Later we'll need to replace this
  if (!user.loading && !user.client && !user.practice && !user.practitioner) return <Redirect to={{ pathname: '/onboarding', query: router.query }} />;

  return (
    <div className="h-full md:h-screen flex bg-white overflow-x-hidden">
      <main className="flex-1 relative focus:outline-none">
        {children}
      </main>
    </div>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
