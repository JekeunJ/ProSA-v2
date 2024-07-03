import React from 'react';
import useAPI from '../hooks/useAPI';
import Employee from './Employee';

export default function EmployeeList() {
  const { data: employees } = useAPI('/v1/employees');

  return (
    <div className="flex flex-col w-80 h-full overflow-auto hidden md:block">
      {employees?.map((employee) => (
        <Employee
          key={employee.id}
          employee={employee}
          className="rounded-none"
        />
      ))}
    </div>
  );
}
