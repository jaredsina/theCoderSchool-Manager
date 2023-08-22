import axios from "axios";

const baseUrl = "http://localhost:3000/api/tasks";

let token = null;
let config = {};

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
  config = {
    headers: { Authorization: token },
  };
};

// The getAll function sends a GET request to the /api/tasks endpoint.
// If the request is successful, the function returns the response data.
const getAll = async () => {
  const response = await axios.get(baseUrl, config);
  return response.data;
};

// The getTask function sends a GET request to the /api/tasks/:id endpoint.
// If the request is successful, the function returns the response data.
const getTask = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`, config);
  return response.data;
};

// The getTasksByParentId function sends a GET request to the /api/tasks/parent/:parentId endpoint.
// If the request is successful, the function returns the response data.
const getTasksByParentId = async (parentId) => {
  const response = await axios.get(
    `${baseUrl}/parentTasks/${parentId}`,
    config,
  );
  return response.data;
};

// The create function sends a POST request to the /api/tasks endpoint with the task data.
// If the request is successful, the function returns the response data.
const create = async (newTask) => {
  const response = await axios.post(baseUrl, newTask, config);
  return response.data;
};

// The delete function sends a DELETE request to the /api/tasks/:id endpoint.
// If the request is successful, the function returns the response data.
const deleteTask = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response.data;
};

// The update function sends a PUT request to the /api/tasks/:id endpoint with the task data.
// If the request is successful, the function returns the response data.
const update = async (id, newTask) => {
  const response = await axios.put(`${baseUrl}/${id}`, newTask, config);
  return response.data;
};

export default {
  getAll,
  setToken,
  create,
  deleteTask,
  update,
  getTask,
  getTasksByParentId,
};
