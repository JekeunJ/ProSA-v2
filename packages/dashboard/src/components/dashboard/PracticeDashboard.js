import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

export default function PracticeDashboard() {
  const router = useRouter();

  // Hotkeys -- great for UX, we can add more or change these
  useHotkeys('m', () => router.push('/messages'));
  useHotkeys('v', () => router.push('/visits'));

  return (
    <>
      <NextSeo title="Practice Dashboard – Recoverise" noindex />
      <main className="dashboard-main">
        <div className="patient-dashboard">
          <h1>Practitioner Dashboard</h1>
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
            {/* TODO: What else do we show here? Practitioner login for upcoming visits? */}
          </div>
        </div>
      </main>
    </>
  );
}
