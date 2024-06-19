import { createContext } from 'react';

const DashboardContext = createContext({
  practice: null,
  setPractice: null,
  practitioner: null,
  setPractitioner: null,
  client: null,
  setClient: null,
});

export default DashboardContext;
