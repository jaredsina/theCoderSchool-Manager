import axios from "axios";

const baseUrl = "http://localhost:3000/api/programs";

let token = null;
let config = {};

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
  config = {
    headers: { Authorization: token },
  };
};

// The getAll function sends a GET request to the /api/programs endpoint.
// If the request is successful, the function returns the response data.
const getAll = async () => {
  const response = await axios.get(baseUrl, config);
  return response.data;
};

// The create function sends a POST request to the /api/programs endpoint with the program data.
// If the request is successful, the function returns the response data.
const create = async (newProgram) => {
  const response = await axios.post(baseUrl, newProgram, config);
  return response.data;
};

// The delete function sends a DELETE request to the /api/programs/:id endpoint.
// If the request is successful, the function returns the response data.
const deleteProgram = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response.data;
};

// The update function sends a PUT request to the /api/programs/:id endpoint with the program data.
// If the request is successful, the function returns the response data.
const update = async (id, newProgram) => {
  const response = await axios.put(`${baseUrl}/${id}`, newProgram, config);
  return response.data;
};

export default { getAll, setToken, create, deleteProgram, update };
