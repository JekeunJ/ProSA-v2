import axios from 'axios';

// Create an employer. This should only be done on onboarding
export const createEmployer = function createEmployer(data) {
  return axios.post('/api/v1/employeer', data)
    .then((response) => response.data);
};

// Update an employer. Only the employer can do this
export const updateEmployer = function updateEmployer(id, data) {
  return axios.patch(`/api/v1/employers/${id}`, data)
    .then((response) => response.data);
};
