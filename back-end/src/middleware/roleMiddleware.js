const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'User authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Role '${req.user.role}' is not authorized for this resource.`,
      });
    }

    next();
  };
};

const requireApprovedOrganiser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User authentication required' });
  }

  // Admins bypass organiser approval check
  if (req.user.role === 'ADMIN') {
    return next();
  }

  if (req.user.role === 'ORGANISER') {
    if (req.user.organiserStatus !== 'APPROVED') {
      return res.status(403).json({
        message: `Your Organiser account status is currently '${req.user.organiserStatus || 'PENDING'}'. Admin approval is required before publishing events.`,
      });
    }
  }

  next();
};

module.exports = { requireRole, requireApprovedOrganiser };
