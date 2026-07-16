const { setRequestContext } = require("../database/database");

function requestContext(req, res, next) {
  setRequestContext(req.method, req.originalUrl);
  next();
}

module.exports = requestContext;