import axios from "axios";

const baseUrl = "http://localhost:3000/api/partners";

let token = null;
let config = {};

// setToken sets the token variable to the given token and configures the config variable to include the token in the Authorization header.
const setToken = (newToken) => {
  token = `bearer ${newToken}`;
  config = {
    headers: { Authorization: token },
  };
};

// getAll sends a GET request to the /api/partners endpoint.
// If the request is successful, the function returns the response data.
const getAll = async () => {
  const response = await axios.get(baseUrl, config);
  return response.data;
};

// create sends a POST request to the /api/partners endpoint with the partner data.
// If the request is successful, the function returns the response data.
const create = async (newPartner) => {
  const response = await axios.post(baseUrl, newPartner, config);
  return response.data;
};

// deletePartner sends a DELETE request to the /api/partners/:id endpoint.
// If the request is successful, the function returns the response data.
const deletePartner = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response.data;
};

// update sends a PUT request to the /api/partners/:id endpoint with the partner data.
// If the request is successful, the function returns the response data.
const update = async (id, newPartner) => {
  const response = await axios.put(`${baseUrl}/${id}`, newPartner, config);
  return response.data;
};

export default { getAll, setToken, create, deletePartner, update };
