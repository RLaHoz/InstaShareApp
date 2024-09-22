const jwt = require('jsonwebtoken');

const handleAuthError = (res, message) => {
  return res.status(401).json({ message });
};

exports.auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return handleAuthError(res, 'Authorization header missing');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return handleAuthError(res, 'Token missing in authorization header');
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.userData = { userId: decodedToken.userId };

    next();
  } catch (error) {
    switch (error.name) {
      case 'TokenExpiredError':
        return handleAuthError(res, 'Token expired, please login again');
      case 'JsonWebTokenError':
        return handleAuthError(res, 'Invalid token, please login again');
      default:
        return handleAuthError(res, 'Authorization failed');
    }
  }
};
