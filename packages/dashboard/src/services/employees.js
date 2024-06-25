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

// Set two employees as friends. To avoid awkwardness only let the employer do this lol
export const setFriends = function setFriends(employee1, employee2) {
  return axios.post('/api/v1/employees/friends', { employees: [employee1, employee2] })
    .then((response) => response.data);
};

// Remove two employees as friends. Same goes as above
export const removeFriends = function removeFriends(employee1, employee2) {
  return axios.delete('/api/v1/employees/friends', { employees: [employee1, employee2] })
    .then((response) => response.data);
};

// Delete an employee. Either the employer or employee can do this. Dangerous action though!
export const deleteEmployee = function deleteEmployee(id) {
  return axios.delete(`/api/v1/employees/${id}`)
    .then((response) => response.data);
};
