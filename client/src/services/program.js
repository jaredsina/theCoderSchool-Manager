import axios from "axios";

const baseUrl = "http://localhost:3000/api/programs";

// The getAll function sends a GET request to the /api/programs endpoint.
// If the request is successful, the function returns the response data.
const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

export default { getAll };
