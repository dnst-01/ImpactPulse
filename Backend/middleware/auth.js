import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Protect routes - require authentication
 */
export const protect = async (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check for token in cookies (optional)
  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ 
      message: 'Not authorized - no token provided' 
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (exclude password)
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ 
        message: 'Not authorized - user not found' 
      });
    }

    if (!req.user.isActive) {
      return res.status(401).json({ 
        message: 'Account has been deactivated' 
      });
    }

    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Not authorized - token expired' 
      });
    }
    
    return res.status(401).json({ 
      message: 'Not authorized - invalid token' 
    });
  }
};

/**
 * Restrict to specific roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role '${req.user.role}' is not authorized to access this route`
      });
    }
    next();
  };
};

/**
 * Optional auth - attach user if token exists, but don't block
 */
export const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Token invalid, but that's okay for optional auth
      req.user = null;
    }
  }

  next();
};


