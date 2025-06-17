import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { loginSchema, registerSchema } from '@hiredesk/shared';
import { User } from '../entities/User';
import { UserProfile } from '../entities/UserProfile';
import { ApiError } from '../middleware/error-handler';
import { createLogger } from '../config/logger';
import { getAuth } from '../config/firebase';
import { AppDataSource } from '../config/database';

const logger = createLogger('auth-controller');

// Mock user for demo mode
const DEMO_USER = {
  id: '1',
  email: 'demo@example.com',
  name: 'Demo User',
  role: 'user',
  profile: {
    company: 'Demo Company',
    phone: '+1234567890',
    address: {
      street: '123 Demo St',
      city: 'Demo City',
      postalCode: '12345',
      country: 'Demo Country',
    },
  },
};

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate request body
      const validatedData = registerSchema.parse(req.body);
      
      if (process.env.DEMO_MODE === 'true') {
        logger.info('Demo mode: Returning mock registration response');
        res.status(201).json({
          success: true,
          data: {
            ...DEMO_USER,
            firebaseUid: 'demo-firebase-uid',
          },
          message: 'Demo registration successful',
        });
        return;
      }

      // Check if user already exists
      const existingUser = await User.findOne({
        where: { email: validatedData.email }
      });

      if (existingUser) {
        throw new ApiError(400, 'USER_EXISTS', 'User with this email already exists');
      }

      // Hash password
      const passwordHash = await bcrypt.hash(validatedData.password, 10);

      // Start transaction
      const queryRunner = AppDataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // Create user
        const user = queryRunner.manager.create(User, {
          email: validatedData.email,
          name: validatedData.name,
          passwordHash,
        });
        await queryRunner.manager.save(user);

        // Create user profile
        const profile = queryRunner.manager.create(UserProfile, {
          userId: user.id,
          company: validatedData.company,
          phone: validatedData.phone,
        });
        await queryRunner.manager.save(profile);

        // Create Firebase user
        const firebaseUser = await getAuth().createUser({
          email: validatedData.email,
          password: validatedData.password,
          displayName: validatedData.name,
        });

        // Update user with Firebase UID
        await queryRunner.manager.update(User, user.id, {
          // Add firebaseUid field to User entity if needed
        });

        await queryRunner.commitTransaction();

        logger.info({ userId: user.id, email: user.email }, 'User registered successfully');

        res.status(201).json({
          success: true,
          data: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            firebaseUid: firebaseUser.uid,
          },
          message: 'Registration successful',
        });
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(new ApiError(400, 'VALIDATION_ERROR', 'Invalid input', error.errors));
      } else {
        next(error);
      }
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate request body
      const validatedData = loginSchema.parse(req.body);

      if (process.env.DEMO_MODE === 'true') {
        logger.info('Demo mode: Returning mock login response');
        res.json({
          success: true,
          data: {
            user: DEMO_USER,
            customToken: 'demo-custom-token',
          },
          message: 'Demo login successful',
        });
        return;
      }

      // Find user
      const user = await User.findOne({
        where: { email: validatedData.email },
        relations: ['profile'],
      });

      if (!user || !user.isActive) {
        throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(validatedData.password, user.passwordHash);
      if (!isPasswordValid) {
        throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
      }

      // Generate custom token for Firebase
      const customToken = await getAuth().createCustomToken(user.email);

      logger.info({ userId: user.id, email: user.email }, 'User logged in successfully');

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
          customToken,
        },
        message: 'Login successful',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(new ApiError(400, 'VALIDATION_ERROR', 'Invalid input', error.errors));
      } else {
        next(error);
      }
    }
  }

  static async getProfile(req: Request, res: Response): Promise<void> {
    if (process.env.DEMO_MODE === 'true') {
      logger.info('Demo mode: Returning mock profile');
      res.json({
        success: true,
        data: DEMO_USER,
      });
      return;
    }

    const userId = req.user!.id;

    const user = await User.findOne({
      where: { id: userId },
      relations: ['profile'],
    });

    if (!user) {
      throw new ApiError(404, 'USER_NOT_FOUND', 'User not found');
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        profile: user.profile ? {
          company: user.profile.company,
          phone: user.profile.phone,
          address: {
            street: user.profile.addressStreet,
            city: user.profile.addressCity,
            postalCode: user.profile.addressPostalCode,
            country: user.profile.addressCountry,
          },
        } : null,
      },
    });
  }
} 