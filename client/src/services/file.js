import axios from "axios";

const baseUrl = "https://camp-organizer.onrender.com/api/files";

let token = null;
let config = {};

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
  config = {
    headers: { Authorization: token },
  };
};

// The getAll function sends a GET request to the /api/files endpoint.
// If the request is successful, the function returns the response data.
const getAll = async () => {
  const response = await axios.get(`${baseUrl}`, config);
  return response.data;
};

/**
 * Retrieves the files for a given parent ID.
 * @param {string} id - The ID of the parent.
 * @returns {Promise<Array>} - A promise that resolves to an array of files.
 */
const getParentFiles = async (id) => {
  const response = await axios.get(`${baseUrl}/parent/${id}`, config);
  return response.data;
};

const getFilesWithUrls = async () => {
  const response = await axios.get(`${baseUrl}/urls`, config);
  return response.data;
};

// The create function sends a POST request to the /api/files endpoint with the file data.
// If the request is successful, the function returns the response data.
const create = async (newFile) => {
  const response = await axios.post(baseUrl, newFile, config);
  return response.data;
};

// The delete function sends a DELETE request to the /api/files/:id endpoint.
// If the request is successful, the function returns the response data.
const deleteFile = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response.data;
};

// The update function sends a PUT request to the /api/files/:id endpoint with the file data.
// If the request is successful, the function returns the response data.
const getFile = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`, config);
  return response.data;
};

export default {
  getAll,
  setToken,
  create,
  deleteFile,
  getFile,
  getParentFiles,
  getFilesWithUrls,
};
