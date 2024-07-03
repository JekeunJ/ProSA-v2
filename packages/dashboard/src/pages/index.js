import faGear from '@fortawesome/pro-regular-svg-icons/faGear';
import React from 'react';
import ShiftList from '../components/ShiftList';
import Icon from '../components/common/Icon';
import Link from '../components/common/Link';
import useEmployer from '../hooks/useEmployer';
import useUser from '../hooks/useUser';

export default function Index() {
  const user = useUser();
  const employer = useEmployer();

  return (
    <div className="flex flex-col w-full h-full">
      <div className="absolute top-0 h-24 inset-x-0 bg-white/75 z-50 flex over flex-col py-10 shadow-md">
        <div className="flex justify-center align-center">
          <div className="text-3xl font-semibold">
            {employer?.business?.name}
          </div>
          {user.employer && (
            <Link
              className="lm-1.5 text-gray-500 hover:text-gray-200"
              href="/settings"
            >
              <Icon icon={faGear} size="xl" />
            </Link>
          )}
        </div>
      </div>
      <ShiftList />
    </div>
  );
}
