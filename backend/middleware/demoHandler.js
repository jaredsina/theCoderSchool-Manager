// Deny file route to demo user because of access to google cloud storage
const denyFileRoute = (req, res, next) => {
  if (req.user.username === "demo") {
    res
      .status(401)
      .json({ error: "Demo user does not have access to file route" });
    return;
  }
  next();
};

module.exports = denyFileRoute;
