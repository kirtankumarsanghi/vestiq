function authMiddleware(_req, _res, next) {
  // Starter mode: pass through requests. Replace with JWT auth when login is added.
  return next();
}

module.exports = authMiddleware;
