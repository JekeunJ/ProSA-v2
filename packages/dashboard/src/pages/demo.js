import React from 'react';
import Card from '../components/common/Card';
import useAPI from '../hooks/useAPI';
import useEmployer from '../hooks/useEmployer';
import useUser from '../hooks/useUser';

export default function Demo() {
  // Demo user hook -- get user data, as well as how they're logged in (user.employer vs user.employee)
  const user = useUser();

  // Demo employer hook -- get the current user's employer
  const employer = useEmployer();

  // Demo useAPI hook -- this is how to read basically any data
  // This one, for example, lists all employees for the current employer
  const { data: employees } = useAPI('/v1/employees');

  // This one lists 10 shifts to which the currently logged in employee is assigned
  const { data: shifts } = useAPI(user?.employee && '/v1/shifts', { employees: user?.employee?.id, limit: 10 });

  // And this one just reads one employee, expanding on their individual shifts and friends
  const employee = useAPI(employees?.length && `/v1/employees/${employees[0].id}`, { expand: 'friends shifts' });

  // Now to display all the raw fetched JSON data
  return (
    <div className="w-full h-screen grid place-content-center bg-gray-50">
      <Card className="max-w-xl max-h-96 overflow-scroll">
        <Card.Header className="text-xl font-bold">Demo Data</Card.Header>
        <Card.Body>
          <p className="text-xl">User Data</p>
          <p>Data fetched using the useUser and useEmployer hooks.</p>
          {user?.user && <p><strong>User: </strong> {JSON.stringify(user.user)}</p>}
          {user?.employer && <p><strong>Logged in as employer: </strong> {JSON.stringify(user.employer)}</p>}
          {user?.employee && <p><strong>Logged in as employee: </strong> {JSON.stringify(user.employee)}</p>}
          <hr />
          {employer && <p><strong>Employer: </strong> {JSON.stringify(employer)}</p>}
          <hr />
          <p className="text-xl">API</p>
          <p>Data fetched from the API using the <code>useAPI()</code> hook</p>
          {employees?.length && (
            <div>
              <strong>Employees</strong>
              <ul>
                {employees.map((e) => <li key={e.id}>{JSON.stringify(e)}</li>)}
              </ul>
            </div>
          )}
          {shifts?.length && (
            <div>
              <strong>Shifts</strong>
              <ul>
                {shifts.map((e) => <li key={e.id}>{JSON.stringify(e)}</li>)}
              </ul>
            </div>
          )}
          {employee && <p><strong>Employee: </strong> {JSON.stringify(employee)}</p>}
        </Card.Body>
      </Card>
    </div>
  );
}
