const jwt = require("jsonwebtoken");

const tokenValidator = (request, response, next) => {
  const { token } = request;
  if (!token) {
    return response.status(401).json({ error: "token missing" });
  }
  const decodedToken = jwt.verify(token, process.env.SECRET);

  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }
  request.decodedToken = decodedToken.id;
  next();
};

module.exports = tokenValidator;
