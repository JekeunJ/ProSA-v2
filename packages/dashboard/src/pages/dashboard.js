import { useRouter } from 'next/router';
import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import PatientDashboard from '../components/dashboard/PatientDashboard';
import PracticeDashboard from '../components/dashboard/PracticeDashboard';
import PractitionerDashboard from '../components/dashboard/PractitionerDashboard';
import Layout from '../components/layout/DashboardLayout';
import useUser from '../hooks/useUser';

function Dashboard() {
  const user = useUser();
  const router = useRouter();

  // Hotkeys -- great for UX, we can add more or change these
  useHotkeys('m', () => router.push('/messages'));
  useHotkeys('v', () => router.push('/visits'));
  useHotkeys('c', () => router.push('/clients'));

  return (
    <Layout breadcrumbs={[{ text: 'Overview', path: 'dashboard' }]}>
      {user?.client && <PatientDashboard />}
      {user?.practitioner && <PractitionerDashboard />}
      {user?.practice && <PracticeDashboard />}
    </Layout>
  );
}

export default Dashboard;
