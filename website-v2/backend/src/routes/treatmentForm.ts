import express from 'express';
import { body } from 'express-validator';
import {
  getTreatmentForm,
  saveTreatmentForm,
  submitTreatmentForm,
  deleteTreatmentForm,
  getTreatmentFormStats
} from '../controllers/treatmentFormController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Validation rules for treatment form data
const treatmentFormValidation = [
  body('dateOfBirth').optional().isLength({ min: 1, max: 50 }),
  body('gender').optional().isIn(['Female', 'Male', 'Transgender', 'Prefer not to say']),
  body('occupation').optional().isLength({ min: 1, max: 100 }),
  body('purposeOfVisit').optional().isArray(),
  body('facialSurgeries').optional().isArray(),
  body('bodyContouring').optional().isArray(),
  body('breastChest').optional().isArray(),
  body('buttocksHips').optional().isArray(),
  body('facialSkin').optional().isArray(),
  body('bodyShape').optional().isArray(),
  body('hairAntiAging').optional().isArray(),
  body('transgenderTreatments').optional().isArray(),
  body('previousProcedures').optional().isBoolean(),
  body('previousProceduresDetails').optional().isLength({ max: 1000 }),
  body('medicalConditions').optional().isLength({ max: 1000 }),
  body('preferredMonth').optional().isLength({ max: 100 }),
  body('includeSightseeing').optional().isBoolean(),
];

// All routes require authentication
router.use(protect);

// Routes
router.get('/', getTreatmentForm);
router.post('/', treatmentFormValidation, saveTreatmentForm);
router.post('/submit', submitTreatmentForm);
router.delete('/', deleteTreatmentForm);

// Admin routes (would need admin middleware in production)
router.get('/stats', getTreatmentFormStats);

export default router;
