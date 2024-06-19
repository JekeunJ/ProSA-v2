import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import React from 'react';
import useUser from '../../hooks/useUser';
import Redirect from '../common/Redirect';
import Breadcrumbs from './Breadcrumbs';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children, breadcrumbs }) {
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
      <Sidebar />
      <div className="flex flex-col w-0 flex-1 md:overflow-y-auto">
        <header className="space-y-2 md:space-y-0 border-b md:border-none">
          <Breadcrumbs stops={breadcrumbs} />
        </header>
        <main className="flex-1 relative focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
  breadcrumbs: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      path: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }),
  ])),
};

DashboardLayout.defaultProps = {
  breadcrumbs: [],
};
