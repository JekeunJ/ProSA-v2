import axios from 'axios';

// Create an employee. Only employers are allowed to do this
export const createEmployee = function createEmployee(email, data) {
  return axios.post('/api/v1/employees', { email, ...data })
    .then((response) => response.data);
};

// Update an employee. Either the employer or employee can do this
export const updateEmployee = function updateEmployee(id, data) {
  return axios.patch(`/api/v1/employees/${id}`, data)
    .then((response) => response.data);
};

// Delete an employee. Either the employer or employee can do this. Dangerous action though!
export const deleteEmployee = function deleteEmployee(id) {
  return axios.delete(`/api/v1/employees/${id}`)
    .then((response) => response.data);
};
