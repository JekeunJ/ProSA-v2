import React from 'react';
import usePractice from '../../hooks/usePractice';
import useUser from '../../hooks/useUser';
import Link from '../common/Link';

export default function Sidebar() {
  const user = useUser();
  const practice = usePractice();

  return (
    <aside className="flex flex-col flex-1 w-60">
      <div className="py-3">
        <a href="home-dashboard.html">
          {/* Eventually this should be the practice logo, with a smaller recoverise logo above it */}
          <img src="images/Recoverise_Name_Logo.svg" alt="Company Logo" style={{ height: 50 }} className="sidebar-logo" />
        </a>
        <input type="text" placeholder="Patient Search..." className="search-bar" />
        {/* Patient/Practitioner Name Subheading */}
        {user?.practitioner && <div className="patient-subheading">{user.practitioner.name}</div>}
        {user?.client && <div className="patient-subheading">{user.client.name}</div>}
      </div>
      {/* Sidebar Navigation */}
      <nav className="flex flex-col flex-1 py-3">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/profile">My Profile</Link>
        {(user?.practitioner || user?.practice) && <Link href="/patients">Patients</Link> }
        {user?.practice && <Link href="/practitioners">Practitioners</Link>}
        {/* Visits includes the calendar */}
        <Link href="/visits">Visits</Link>
        {/* Exercises included on the Injury Report page */}
        <Link href="/injuries">Injury Reports</Link>
        <Link href="/health_records">Health Records</Link>
        <hr />
        {user?.practitioner && <Link href="/notes">Notes</Link>}
        {(user?.practitioner || user?.client) && <Link href="/messages">Messages</Link>}
        {/* Billing available in practice view or practitionr view if logged in as admin or if logged in as practitioner-owner */}
        {(user?.practice || (user?.practitioner && user?.practitioner.user === practice.owner)) && <Link href="/billing">Billing</Link>}
      </nav>
    </aside>
  );
}
