import axios from 'axios';
import React from 'react';
import { SWRConfig } from 'swr';
import './global.css';
import DashboardContext from '../context/DashboardContext';

export default function App({ Component, pageProps }) {
  // Save current practice for admin users who may have access to multiple practices
  const [practice, setPractice] = React.useState(null);

  const dashboardContext = React.useMemo(() => ({
    practice,
    setPractice,
  }), [practice]);

  // Load practice from local storage
  React.useEffect(() => {
    setPractice(localStorage.getItem('practice'));
  }, []);

  // Save practice in local storage when changed
  React.useEffect(() => {
    if (practice) localStorage.setItem('practice', practice);
  }, [practice]);

  return (
    <DashboardContext.Provider value={dashboardContext}>
      <SWRConfig value={{
        fetcher: (url, query) => {
          return axios.get(url, {
            headers: { 'Recoverise-Practice': practice },
            params: query && JSON.parse(query),
          }).then((res) => res.data);
        },
      }}
      >
        <Component {...pageProps} />
      </SWRConfig>
    </DashboardContext.Provider>
  );
}
