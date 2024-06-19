import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import Button from '../common/Button';
import Link from '../common/Link';

export default function PatientDashboard() {
  const router = useRouter();

  // Hotkeys -- great for UX, we can add more or change these
  useHotkeys('m', () => router.push('/messages'));
  useHotkeys('v', () => router.push('/visits'));

  return (
    <>
      <NextSeo title="Patient Dashboard – Recoverise" noindex />
      <main className="dashboard-main">
        <div className="patient-dashboard">
          <h1>Patient Dashboard</h1>
          <Button as={Link} className="record-visit-btn" href="/visits/new">Record a Visit</Button>
          <div className="dashboard-sections">
            <section className="patient-history">
              <h2>Past Visits</h2>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Injury</th>
                    <th>Injury Date</th>
                    <th>Recovery %</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Rows dynamically inserted here */}
                </tbody>
              </table>
              <div className="pagination">
                <a href="#">&laquo; Previous</a>
                <a href="#">1</a>
                <a href="#">2</a>
                <a href="#">3</a>
                <a href="#">Next &raquo;</a>
              </div>
            </section>
            <section className="recovery-progress">
              <h2>Recovery Progress</h2>
              {/* Placeholder for recovery progress charts */}
              <div className="progress-charts">
                {/* Dynamic content */}
              </div>
            </section>
            <section className="upcoming-appointments">
              <h2>Upcoming Appointments</h2>
              {/* Placeholder for appointments list */}
              <ul className="appointments-list">
                {/* Dynamic content */}
              </ul>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
