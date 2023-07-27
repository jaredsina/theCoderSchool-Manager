import axios from "axios";

const baseUrl = "http://localhost:3000/api/login";

// The login function sends a POST request to the /api/login endpoint with the user's credentials.
// If the login is successful, the function returns the response data.
const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials);
  return response.data;
};

export default { login };
