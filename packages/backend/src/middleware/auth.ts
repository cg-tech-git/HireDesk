import { Request, Response, NextFunction } from 'express';
import { verifyIdToken } from '../config/firebase';
import { UserRole } from '@hiredesk/shared';
import { createLogger } from '../config/logger';
import { User } from '../entities/User';

const logger = createLogger('auth-middleware');

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: UserRole;
        firebaseUid?: string;
      };
    }
  }
}

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'No authentication token provided',
        },
      });
      return;
    }

    const token = authHeader.substring(7);
    
    try {
      // Verify Firebase token
      const decodedToken = await verifyIdToken(token);
      
      // Find user in database
      const user = await User.findOne({
        where: { email: decodedToken.email },
      });

      if (!user || !user.isActive) {
        res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'User not found or inactive',
          },
        });
        return;
      }

      // Attach user to request
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        firebaseUid: decodedToken.uid,
      };

      logger.info({ userId: user.id, email: user.email }, 'User authenticated');
      next();
    } catch (error) {
      logger.error({ error }, 'Token verification failed');
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid authentication token',
        },
      });
    }
  } catch (error) {
    logger.error({ error }, 'Authentication middleware error');
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Authentication failed',
      },
    });
  }
}

// Role-based access control middleware
export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn(
        { userId: req.user.id, role: req.user.role, required: allowedRoles },
        'Access denied - insufficient permissions'
      );
      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient permissions',
        },
      });
      return;
    }

    next();
  };
} 