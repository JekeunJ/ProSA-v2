/* eslint-disable import/prefer-default-export */
import axios from 'axios';

// Update a user. May need to use this for phone numbers eventually
export const updateUser = function updateUser(data) {
  return axios.patch('/api/v1/users', data)
    .then((response) => response.data);
};
