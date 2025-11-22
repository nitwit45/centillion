import express from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  verifyEmail,
  changePassword,
  updateProfile,
  getMe
} from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Validation rules
const registerValidation = [
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('age')
    .trim()
    .isLength({ min: 1, max: 3 })
    .withMessage('Please provide a valid age'),
  body('phone')
    .trim()
    .isLength({ min: 10, max: 15 })
    .withMessage('Please provide a valid phone number'),
  body('country')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Please provide a valid country'),
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .exists()
    .withMessage('Password is required'),
];

const changePasswordValidation = [
  body('oldPassword')
    .exists()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),
];

const verifyEmailValidation = [
  body('token')
    .exists()
    .withMessage('Verification token is required'),
];

const updateProfileValidation = [
  body('fullName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  body('age')
    .optional()
    .trim()
    .isLength({ min: 1, max: 3 })
    .withMessage('Please provide a valid age'),
  body('phone')
    .optional()
    .trim()
    .isLength({ min: 10, max: 15 })
    .withMessage('Please provide a valid phone number'),
  body('country')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Please provide a valid country'),
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/verify-email', verifyEmailValidation, verifyEmail);
router.post('/change-password', protect, changePasswordValidation, changePassword);
router.put('/profile', protect, updateProfileValidation, updateProfile);
router.get('/me', protect, getMe);

export default router;
