import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import User, { IUser } from '../models/User';
import { config } from '../config';
import emailService from '../utils/emailService';

interface RegisterData {
  fullName: string;
  email: string;
  age: string;
  phone: string;
  country: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

interface UpdateProfileData {
  fullName: string;
  age: string;
  phone: string;
  country: string;
}

// Generate JWT token
const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, config.jwtSecret, {
    expiresIn: config.jwtExpire,
  } as jwt.SignOptions);
};

// Generate email verification token
const generateVerificationToken = (): string => {
  return uuidv4();
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response) => {
  try {
    const { fullName, email, age, phone, country }: RegisterData = req.body;

    // MongoDB unique constraint will handle duplicates

    // Generate user ID and verification token
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const verificationToken = generateVerificationToken();

    // Create user with temporary password (they'll set a new one after email verification)
    const tempPassword = Math.random().toString(36).slice(-10);

    const user = new User({
      id: userId,
      fullName,
      email: email,
      age,
      phone,
      country,
      password: tempPassword, // This will be hashed by the pre-save middleware
      isVerified: false,
      isFirstLogin: true,
      passwordSet: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    await user.save();

    // Send verification email
    try {
      await emailService.sendVerificationEmail(email, verificationToken, fullName);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail registration if email fails, but log it
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email to verify your account.',
      userId: user.id
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during registration'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password }: LoginData = req.body;

    // Find user by email
    const user = await User.findOne({
      email: email
    }).collation({ locale: 'en', strength: 2 });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        error: 'Please verify your email before logging in'
      });
    }

    // Generate JWT token
    const token = generateToken(user.id);

    // Update last login
    user.isFirstLogin = false;
    await user.save();

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        age: user.age,
        phone: user.phone,
        country: user.country,
        isVerified: user.isVerified,
        isFirstLogin: user.isFirstLogin,
        passwordSet: user.passwordSet,
        profileCompleted: user.profileCompleted,
        beautyFormSubmitted: user.beautyFormSubmitted,
        beautyFormStatus: user.beautyFormStatus,
        role: user.role,
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during login'
    });
  }
};

// @desc    Verify email
// @route   POST /api/auth/verify-email
// @access  Public
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Verification token is required'
      });
    }

    // Find user with matching verification token
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired verification token'
      });
    }

    // Update user as verified
    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Generate JWT token for immediate login
    const jwtToken = generateToken(user.id);

    res.json({
      success: true,
      message: 'Email verified successfully!',
      token: jwtToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        age: user.age,
        phone: user.phone,
        country: user.country,
        isVerified: user.isVerified,
        isFirstLogin: user.isFirstLogin,
        passwordSet: user.passwordSet,
        profileCompleted: user.profileCompleted,
        beautyFormSubmitted: user.beautyFormSubmitted,
        beautyFormStatus: user.beautyFormStatus,
      }
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during email verification'
    });
  }
};

// @desc    Change password
// @route   POST /api/auth/change-password
// @access  Private
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { oldPassword, newPassword }: ChangePasswordData = req.body;
    const userId = (req as any).user.userId;

    // Find user
    const user = await User.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // If password hasn't been set yet (user came from email verification),
    // don't require old password
    if (!user.passwordSet) {
      // Just set the new password without checking old password
      user.password = newPassword;
      user.passwordSet = true;
      user.isFirstLogin = false;
      await user.save();

      return res.json({
        success: true,
        message: 'Password set successfully!'
      });
    }

    // For existing users changing password, check old password
    const isOldPasswordValid = await user.comparePassword(oldPassword);
    if (!isOldPasswordValid) {
      return res.status(400).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully!'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during password change'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { fullName, age, phone, country }: UpdateProfileData = req.body;
    const userId = (req as any).user.userId;

    // Find user
    const user = await User.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Update user fields
    if (fullName) user.fullName = fullName;
    if (age) user.age = age;
    if (phone) user.phone = phone;
    if (country) user.country = country;

    // Mark profile as completed if all fields are filled
    if (fullName && age && phone && country) {
      user.profileCompleted = true;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        age: user.age,
        phone: user.phone,
        country: user.country,
        isVerified: user.isVerified,
        isFirstLogin: user.isFirstLogin,
        passwordSet: user.passwordSet,
        profileCompleted: user.profileCompleted,
        beautyFormSubmitted: user.beautyFormSubmitted,
        beautyFormStatus: user.beautyFormStatus,
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during profile update'
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const user = await User.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        age: user.age,
        phone: user.phone,
        country: user.country,
        isVerified: user.isVerified,
        isFirstLogin: user.isFirstLogin,
        passwordSet: user.passwordSet,
        profileCompleted: user.profileCompleted,
        beautyFormSubmitted: user.beautyFormSubmitted,
        beautyFormStatus: user.beautyFormStatus,
        role: user.role,
      }
    });

  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};
