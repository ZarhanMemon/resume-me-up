import { verify } from 'jsonwebtoken';
import Users from '../models/Users.js';

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No shadow energy detected.'
      });
    }

    const decoded = verify(token, process.env.JWT_SECRET);
    const user = await Users.findById(decoded.id);
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Hunter not found or inactive.'
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid shadow energy signature.'
    });
  }
};

export default auth;