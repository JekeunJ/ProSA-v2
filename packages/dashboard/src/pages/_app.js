import axios from 'axios';
import React from 'react';
import { SWRConfig } from 'swr';
import './global.css';
import DashboardContext from '../context/DashboardContext';

export default function App({ Component, pageProps }) {
  // Save current employer for users who may be employed by multiple
  const [employer, setEmployer] = React.useState(null);

  const dashboardContext = React.useMemo(() => ({
    employer,
    setEmployer,
  }), [employer]);

  // Load employer from local storage
  React.useEffect(() => {
    setEmployer(localStorage.getItem('employer'));
  }, []);

  // Save employer in local storage when changed
  React.useEffect(() => {
    if (employer) localStorage.setItem('employer', employer);
  }, [employer]);

  return (
    <DashboardContext.Provider value={dashboardContext}>
      <SWRConfig value={{
        fetcher: (url, query) => {
          return axios.get(url, {
            headers: { 'ProSa-Employer': employer },
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
