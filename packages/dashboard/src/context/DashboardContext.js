import { createContext } from 'react';

const DashboardContext = createContext({
  employer: null,
  setEmployer: null,
  employee: null,
  setEmployee: null,
});

export default DashboardContext;
