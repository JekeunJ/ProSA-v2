/* eslint-disable react/prop-types */
import { useDraggable } from '@dnd-kit/core';
import { faSpinner } from '@fortawesome/pro-regular-svg-icons/faSpinner';
import { faUserMinus } from '@fortawesome/pro-regular-svg-icons/faUserMinus';
import { faUserPlus } from '@fortawesome/pro-regular-svg-icons/faUserPlus';
import { faUserXmark } from '@fortawesome/pro-regular-svg-icons/faUserXmark';
import { Transition, Popover } from '@headlessui/react';
import clsx from 'clsx';
import dayjs from 'lib/dayjs';
import React from 'react';
import Stars from 'react-stars';
import useAPI from '../hooks/useAPI';
import useUser from '../hooks/useUser';
import { updateEmployee, removeFriends, setFriends } from '../services/employees';
import { updateShift } from '../services/shifts';
import Avatar from './common/Avatar';
import Button from './common/Button';
import Icon from './common/Icon';

export default function Employee({
  className, employee: propEmployee, shift, modifiable = true, draggable = false,
}) {
  const [removeLoading, setRemoveLoading] = React.useState(false);
  const employee = useAPI(`/v1/employees/${propEmployee.id}`, { expand: 'friends hours' }, { fallbackData: propEmployee });
  const user = useUser();
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: employee.id,
    disabled: !draggable,
    data: employee,
  });

  const onRemoveEmployee = React.useCallback(() => {
    if (!shift) return; // Should never be reached

    setRemoveLoading(true);
    updateShift(shift.id, { employees: { $pull: employee.id } })
      .then((data) => shift?.mutate(data, false))
      .then(() => setRemoveLoading(false));
  }, [employee.id, shift]);

  const onStarChange = React.useCallback((newRating) => {
    employee.mutate({ ...employee, rating: newRating });
    updateEmployee(employee.id, { rating: newRating })
      .then((data) => employee.mutate(data, false));
  }, [employee]);

  const onRemoveFriend = React.useCallback((friend) => {
    employee.mutate({ ...employee, friends: employee.friends.filter(({ id }) => id !== friend.id) }, false);

    removeFriends(employee.id, friend.id)
      .then((data) => employee.mutate(data, false));
  }, [employee]);

  const onAddFriend = React.useCallback((friend) => {
    employee.mutate({ ...employee, friends: [...employee.friends, friend] }, false);

    setFriends(employee.id, friend.id)
      .then((data) => employee.mutate(data, false));
  }, [employee]);

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        className,
        'rounded border border-gray-200 bg-white shadow-lg py-3 px-4 max-w-sm',
        {
          'opacity-100': !isDragging,
          'opacity-75': isDragging,
        },
      )}
      {...listeners}
      {...attributes}
    >
      <div className="flex">
        <Avatar
          size="md"
          className="mr-1.5"
          src={employee.profile_picture} // This field does not yet exist
          alt={employee.name.split(' ').map((name) => name[0].toUpperCase()).join('')}
        />
        <div className="flex flex-col mr-1.5">
          <p>{employee.name}</p>
          {employee.hours && (
            <p className="text-gray-400 text-sm">
              Working {employee.hours[dayjs(shift?.start_time).startOf('week').unix()]} hours this week
            </p>
          )}
        </div>
        {(shift && modifiable) && (
          <Button
            className="self-end background-transparent text-red-500"
            size="sm"
            loading={removeLoading}
            icon={faUserXmark}
            onClick={onRemoveEmployee}
          >
            Remove from shift
          </Button>
        )}
      </div>
      {employee.stars !== null && user.employer && (
        <Stars
          count={5}
          size={16}
          edit={modifiable}
          half={false}
          onChange={onStarChange}
        />
      )}
      {employee?.friends?.length > 0 && user.employer && (
        <div className="flex flex-wrap">
          <div className="text-gray-400 text-sm">
            Works well with {employee.friends.map((friend, i) => (
              <React.Fragment key={friend.id}>
                <button
                  type="button"
                  onClick={() => modifiable && onRemoveFriend(friend)}
                  className={clsx(
                    'group appearance-none background-transparent',
                    { 'transition hover:text-red-500': modifiable },
                  )}
                >
                  {friend.name}
                </button>
                {i !== employee.friends.length - 1 && ', '}
              </React.Fragment>
          ))}
          </div>
          {modifiable && (
            <Employee.Select
              className="bg-transparent ml-1.5"
              size="xs"
              query={{
                _id: { $nin: [employee.id, ...employee.friends.map(({ id }) => id)] },
              }}
              onSelect={onAddFriend}
            />
          )}
        </div>
      )}
    </div>
  );
}

Employee.Select = function EmployeeSelect({
  className, size = 'sm', shift, query, onSelect,
}) {
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { data: employees, loading: employeesLoading } = useAPI('/v1/employees', { ...query, sort: { rating: -1 } });

  const onClick = React.useCallback((employee) => {
    setLoading(true);

    onSelect(employee)
      .then(() => setLoading(false));
  }, [onSelect]);

  const iconSize = React.useMemo(() => {
    if (size === 'xs') return 'xs';
    if (size === 'sm') return 'sm';
    if (size === 'md') return 'md';
    if (size === 'lg') return 'lg';
    if (size === 'xl') return '2x';
  }, [size]);

  return (
    <Popover>
      <Popover.Button
        className={clsx(
          className,
          'appearance-none inline-block focus:outline-none rounded-full bg-gray-200 hover:bg-gray-300 text-gray-500 text-md',
          { 'w-6 h-6': size === 'xs' },
          { 'w-9 h-9': size === 'sm' },
          { 'w-12 h-12': size === 'md' },
          { 'w-16 h-16': size === 'lg' },
          { 'w-24 h-24': size === 'xl' },
          { 'w-32 h-32': size === '2xl' },
        )}
        disabled={loading}
        onClick={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        {loading ? <Icon icon={faSpinner} className="animate-spin" size={iconSize} /> : <Icon icon={faUserPlus} size={iconSize} />}
      </Popover.Button>
      <Transition
        show={open}
        className="relative"
        enter="transition-all duration-75"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition-all duration-150"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel
          static
          className="absolute outline-none z-30 origin-center max-w-sm min-w-max"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <div className="flex flex-col rounded border border-gray-200 h-80 overflow-auto">
            {!employeesLoading
              ? (
                employees?.map((employee) => (
                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                  <div
                    key={employee.id}
                    className="appearance-none"
                    aria-label={`Add ${employee.name}`}
                    onClick={() => onClick(employee)}
                  >
                    <Employee
                      className="rounded-none z-50"
                      shift={shift}
                      employee={employee}
                      modifiable={false}
                    />
                  </div>
                )) || <p className="text-gray-400">No employees found</p>)
              : (<Icon icon={faSpinner} className="animate-spin" />)}
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};
