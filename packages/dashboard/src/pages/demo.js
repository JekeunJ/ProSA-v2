// Demo page to test hooks and auth!
import React from 'react';
import Layout from '../components/layout/DashboardLayout';
import useAPI from '../hooks/useAPI';
import usePractice from '../hooks/usePractice';
import useUser from '../hooks/useUser';

function Demo() {
  // Demo user hook -- use this for auth/seeing who is logged in
  const user = useUser();

  // Demo practice hook -- use this to see the current practice, mostly for branding and settings
  const practice = usePractice();

  // Demo list API hook -- list data from the API like this
  const { data: injuries } = useAPI('/v1/injuries', { joint: 'shoulder' });

  // And retrieve specific data like this
  const injury = useAPI(injuries?.length && `/v1/injuries/${injuries[0].id}`);

  return (
    <Layout breadcrumbs={[{ text: 'Overview', path: 'demo' }]}>
      {user?.user && <p><strong>User data: </strong>{JSON.stringify(user.user)}</p>}
      {user?.client && <p><strong>Logged in as client: </strong>{JSON.stringify(user.client)}</p>}
      {user?.practitioner && <p><strong>Logged in as practitioner: </strong>{JSON.stringify(user.practitioner)}</p>}
      {user?.practice && <p><strong>Logged in as practice: </strong>{JSON.stringify(user.practice)}</p>}
      <hr />
      {practice && <p><strong>Practice data: </strong>{JSON.stringify(practice)}</p>}
      <hr />
      {injuries && (
        <>
          <strong>Injuries: </strong>
          <ul>
            {injuries.map((i) => <li key={i.id}>{JSON.stringify(i)}</li>)}
          </ul>
        </>
      )}
      {injury && (
        <p>
          <strong>Individually fetched injury (should match first in list): </strong>
          {JSON.stringify(injury)}
        </p>
      )}
    </Layout>
  );
}

export default Demo;
