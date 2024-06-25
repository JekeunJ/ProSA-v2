import axios from 'axios';

// Create a shift. Only employers are allowed to do this
export const createShift = function createShift(data) {
  return axios.post('/api/v1/shifts', data)
    .then((response) => response.data);
};

// Update a shift. Only let the employer do this
export const updateShift = function updateShift(id, data) {
  return axios.patch(`/api/v1/shifts/${id}`, data)
    .then((response) => response.data);
};

// Add an employee to a shift. Uses the same method as updateShift under the hood
export const assignShift = function updateShift(id, employeeId) {
  return axios.patch(`/api/v1/shifts/${id}`, { $addToSet: { employees: employeeId } })
    .then((response) => response.data);
};

// Delete a shift. Only let employers do this
export const deleteShift = function deleteShift(id) {
  return axios.delete(`/api/v1/employees/${id}`)
    .then((response) => response.data);
};
