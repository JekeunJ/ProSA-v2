/* eslint-disable react/prop-types */
import { useDroppable } from '@dnd-kit/core';
import { faUserCheck } from '@fortawesome/pro-regular-svg-icons/faUserCheck';
import clsx from 'clsx';
import dayjs from 'lib/dayjs';
import React from 'react';
import useAPI from '../hooks/useAPI';
import useUser from '../hooks/useUser';
import { addEmployeeToShift } from '../services/shifts';
import Employee from './Employee';
import EmployeePreview from './EmployeePreview';
import Badge from './common/Badge';
import Icon from './common/Icon';

function getTimeOfDay(time) {
  const hour = dayjs(time).hour();

  if (hour >= 5 && hour < 12) {
    return 'Morning';
  } else if (hour === 12) {
    return 'Noon';
  } else if (hour > 12 && hour < 17) {
    return 'Afternoon';
  } else if (hour >= 17 && hour < 21) {
    return 'Evening';
  } else {
    return 'Night';
  }
}

function getTimeLabel(start, end) {
  // const day = dayjs(start).day() !== dayjs().day() ? `${dayjs(start).format('MMM DD')}, ` : '';
  const time = `${dayjs(start).format('h:mma')} - ${dayjs(end).format('h:mma')}`;
  return time;
}

export default function Shift({ shift: propShift, className }) {
  const shift = useAPI(`/v1/shifts/${propShift.id}`, { expand: 'employees' }, { fallbackData: propShift });
  const user = useUser();
  const { setNodeRef, active } = useDroppable({
    id: shift.id,
    data: shift,
  });

  const dropDisabled = active && shift.employees.find(({ id }) => id === active.id);
  const vacancies = Math.max(0, shift.min_employees - shift.employees.length);

  const onAddEmployee = React.useCallback((employee) => {
    shift.mutate({ ...shift, employees: [...shift.employees, employee] }, false);

    return addEmployeeToShift(shift.id, employee.id)
      .then((data) => shift.mutate(data, false));
  }, [shift]);

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        className,
        'w-full md:w-auto h-40 bg-gray-200 rounded-md p-5 space-y-1.5',
        {
          'opacity-50': shift.status === 'canceled' || dropDisabled,
          'border-4 border-blue-400 outline outline-blue-200': shift.status === 'active',
          'border-4 border-red-400 outline outline-red-200': shift.employees.length < shift.min_employees,
          'h-52': dayjs.duration(shift.duration) > dayjs.duration(2, 'hours'),
          'h-60': dayjs.duration(shift.duration) > dayjs.duration(6, 'hours'),
        },
      )}
    >
      <div className="flex items-center space-x-1.5">
        <p className="text-xl">{shift.name || `${getTimeOfDay(shift.start_time)} Shift`}</p>
        {shift.employees.length < shift.min_employees && <Badge color="red" size="xs">Understaffed</Badge>}
        {shift.status === 'active' && <Badge color="blue" size="xs">Active</Badge>}
        {shift.employees.length >= shift.max_employeees && <Badge color="yellow" size="xs">Full</Badge>}
        {shift.status === 'canceled' && <Badge color="red" size="xs">Canceled</Badge>}
      </div>
      <p className="text-lg opacity-75">{getTimeLabel(shift.start_time, shift.end_time)}</p>
      <div className="flex space-x-1.5">
        {shift.employees.map((employee) => (
          <EmployeePreview
            key={employee.id}
            employee={employee}
          />
        ))}
        {vacancies > 0 && user.employer && Array.from({ length: vacancies }).map((_, i) => (
          <Employee.Select
            key={i + shift.employees.length}
            query={{
              _id: { $nin: shift.employees.map(({ id }) => id) },
              sort: { rating: -1 },
            }}
            onSelect={onAddEmployee}
          />
        ))}
        {vacancies > 0 && user.employee && !user.employer && !shift.employees.find(({ id }) => id === user.employee.id) && (
          <button
            type="button"
            aria-label="Add self to shift"
            className="appearance-none inline-block h-9 w-9 focus:outline-none rounded-full outline outline-emerald-400 bg-emerald-200 hover:bg-emerald-300 text-gray-500 text-md"
            onClick={() => onAddEmployee(user.employee)}
          >
            <Icon icon={faUserCheck} size="sm" />
          </button>
        )}
      </div>
    </div>
  );
}
