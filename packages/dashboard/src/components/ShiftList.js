import { DndContext } from '@dnd-kit/core';
import dayjs from 'lib/dayjs';
import React from 'react';
import { useSWRConfig } from 'swr';
import useAPI from '../hooks/useAPI';
import useUser from '../hooks/useUser';
import { addEmployeeToShift } from '../services/shifts';
import EmployeeList from './EmployeeList';
import Shift from './Shift';

export default function ShiftList() {
  const [now] = React.useState(Date.now());
  const { data: shifts } = useAPI('/v1/shifts', { end_time: { $gte: now }, expand: 'employees', sort: { start_time: 1 } });
  const user = useUser();

  const { mutate } = useSWRConfig();

  const handleDragEnd = React.useCallback(({ active: employee, over: shift }) => {
    // Optimistically mutate shift
    mutate(`/v1/shifts/${shift.id}`, {
      ...shift.data,
      employees: [shift.data.employees, employee.data],
    }, false);

    // Then update
    addEmployeeToShift(shift.id, employee.id)
      .then((data) => mutate((`/v1/shifts/${shift.id}`, data, false)));
  }, [mutate]);

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex h-screen w-screen pt-24">
        <div className="flex-1 overflow-auto flex flex-col md:flex-row md:flex-wrap space-y-10 p-5">
          {shifts?.map((shift, i) => {
            return (
              <React.Fragment key={shift.id}>
                {(i === 0 || !dayjs(shift.start_time).isSame(dayjs(shifts[i - 1].start_time), 'day')) && (
                  <p className="text-3xl md:flex-grow md:basis-full">
                    {dayjs(shift.start_time).format('MMMM D')}
                  </p>
                )}
                <Shift className="md:flex-auto mx-3" shift={shift} key={shift.id} />
              </React.Fragment>
            );
          })}
        </div>
        {user.employer && <EmployeeList />}
      </div>
    </DndContext>
  );
}
