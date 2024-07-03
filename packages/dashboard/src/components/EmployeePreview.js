/* eslint-disable react/prop-types */
import { Popover, Transition } from '@headlessui/react';
import React from 'react';
import useAPI from '../hooks/useAPI';
import Employee from './Employee';
import Avatar from './common/Avatar';

export default function EmployeePreview({ employee: propEmployee, shift }) {
  const [open, setOpen] = React.useState(false);
  const employee = useAPI(`/v1/employees/${propEmployee.id}`, { expand: 'friends hours' }, { fallbackData: propEmployee });

  return (
    <Popover className="relative inline-block">
      <Popover.Button
        className="appearance-none focus:outline-none"
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <Avatar
          src={employee.profile_picture} // This field does not yet exist
          alt={employee.name.split(' ').map((name) => name[0].toUpperCase()).join('')}
        />
      </Popover.Button>
      <Transition
        show={open}
        enter="transition-all duration-75"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition-all duration-150"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel
          static
          className="absolute outline-none z-30 bottom-10 left-1/2 -translate-x-1/2 origin-bottom max-w-sm min-w-max"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <Employee employee={employee} shift={shift} />
          <div className="absolute top-auto left-0 right-0 flex justify-center z-30">
            <svg className="w-[20px] h-[10px] -mt-px">
              <path className="stroke-current text-gray-200" fill="none" d="M0 0 L10 8 L20 0" strokeWidth={2} />
              <path className="fill-current text-white" stroke="none" d="M0 0 L10 8 L20 0" />
            </svg>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
