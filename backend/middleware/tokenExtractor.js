// This middleware extracts the token from the request header and adds it to the request object.
const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    // remove "bearer " from the token
    request.token = authorization.substring(7);
  }
  next();
};

module.exports = tokenExtractor;
