import { Request, Response } from 'express';
import TreatmentForm, { ITreatmentForm } from '../models/TreatmentForm';
import User from '../models/User';

interface TreatmentFormData {
  // Personal Info
  dateOfBirth: string;
  gender: string;
  occupation: string;

  // Purpose of Visit
  purposeOfVisit: string[];

  // Surgical Treatments
  facialSurgeries: string[];
  bodyContouring: string[];
  breastChest: string[];
  buttocksHips: string[];

  // Non-Surgical Treatments
  facialSkin: string[];
  bodyShape: string[];
  hairAntiAging: string[];

  // Transgender Treatments
  transgenderTreatments: string[];

  // Additional Information
  previousProcedures: boolean;
  previousProceduresDetails: string;
  medicalConditions: string;
  preferredMonth: string;
  includeSightseeing: boolean;
}

// @desc    Get treatment form for current user
// @route   GET /api/treatment-form
// @access  Private
export const getTreatmentForm = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const treatmentForm = await TreatmentForm.findOne({ userId })
      .populate('user', 'fullName email');

    if (!treatmentForm) {
      return res.status(404).json({
        success: false,
        error: 'Treatment form not found'
      });
    }

    res.json({
      success: true,
      treatmentForm: {
        id: treatmentForm._id,
        userId: treatmentForm.userId,
        dateOfBirth: treatmentForm.dateOfBirth,
        gender: treatmentForm.gender,
        occupation: treatmentForm.occupation,
        purposeOfVisit: treatmentForm.purposeOfVisit,
        facialSurgeries: treatmentForm.facialSurgeries,
        bodyContouring: treatmentForm.bodyContouring,
        breastChest: treatmentForm.breastChest,
        buttocksHips: treatmentForm.buttocksHips,
        facialSkin: treatmentForm.facialSkin,
        bodyShape: treatmentForm.bodyShape,
        hairAntiAging: treatmentForm.hairAntiAging,
        transgenderTreatments: treatmentForm.transgenderTreatments,
        previousProcedures: treatmentForm.previousProcedures,
        previousProceduresDetails: treatmentForm.previousProceduresDetails,
        medicalConditions: treatmentForm.medicalConditions,
        preferredMonth: treatmentForm.preferredMonth,
        includeSightseeing: treatmentForm.includeSightseeing,
        status: treatmentForm.status,
        submittedAt: treatmentForm.submittedAt,
        lastModifiedAt: treatmentForm.lastModifiedAt,
        createdAt: treatmentForm.createdAt,
        updatedAt: treatmentForm.updatedAt,
      }
    });

  } catch (error) {
    console.error('Get treatment form error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching treatment form'
    });
  }
};

// @desc    Create or update treatment form for current user
// @route   POST /api/treatment-form
// @access  Private
export const saveTreatmentForm = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const formData: Partial<TreatmentFormData> = req.body;

    // Find the user
    const user = await User.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Find existing treatment form or create new one
    let treatmentForm = await TreatmentForm.findOne({ userId });

    if (treatmentForm) {
      // Update existing form
      Object.assign(treatmentForm, formData);
      await treatmentForm.save();
    } else {
      // Create new form
      treatmentForm = new TreatmentForm({
        userId,
        user: user._id,
        ...formData,
      });
      await treatmentForm.save();
    }

    // Update user's beauty form status if this is a draft save
    if (treatmentForm.status === 'draft') {
      user.beautyFormSubmitted = false;
      user.beautyFormStatus = 'draft';
      await user.save();
    }

    res.json({
      success: true,
      message: 'Treatment form saved successfully',
      treatmentForm: {
        id: treatmentForm._id,
        userId: treatmentForm.userId,
        dateOfBirth: treatmentForm.dateOfBirth,
        gender: treatmentForm.gender,
        occupation: treatmentForm.occupation,
        purposeOfVisit: treatmentForm.purposeOfVisit,
        facialSurgeries: treatmentForm.facialSurgeries,
        bodyContouring: treatmentForm.bodyContouring,
        breastChest: treatmentForm.breastChest,
        buttocksHips: treatmentForm.buttocksHips,
        facialSkin: treatmentForm.facialSkin,
        bodyShape: treatmentForm.bodyShape,
        hairAntiAging: treatmentForm.hairAntiAging,
        transgenderTreatments: treatmentForm.transgenderTreatments,
        previousProcedures: treatmentForm.previousProcedures,
        previousProceduresDetails: treatmentForm.previousProceduresDetails,
        medicalConditions: treatmentForm.medicalConditions,
        preferredMonth: treatmentForm.preferredMonth,
        includeSightseeing: treatmentForm.includeSightseeing,
        status: treatmentForm.status,
        submittedAt: treatmentForm.submittedAt,
        lastModifiedAt: treatmentForm.lastModifiedAt,
        createdAt: treatmentForm.createdAt,
        updatedAt: treatmentForm.updatedAt,
      }
    });

  } catch (error) {
    console.error('Save treatment form error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while saving treatment form'
    });
  }
};

// @desc    Submit treatment form (final submission)
// @route   POST /api/treatment-form/submit
// @access  Private
export const submitTreatmentForm = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    // Find the treatment form
    const treatmentForm = await TreatmentForm.findOne({ userId });
    if (!treatmentForm) {
      return res.status(404).json({
        success: false,
        error: 'Treatment form not found. Please save your form first.'
      });
    }

    // Validate required fields
    if (!treatmentForm.dateOfBirth || !treatmentForm.gender || !treatmentForm.occupation ||
        !treatmentForm.purposeOfVisit || treatmentForm.purposeOfVisit.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please complete all required fields before submitting'
      });
    }

    // Check if required documents are uploaded (this would be checked on frontend)
    // For now, we'll assume the frontend validates this

    // Update form status
    treatmentForm.status = 'submitted';
    treatmentForm.submittedAt = new Date();
    await treatmentForm.save();

    // Update user status
    const user = await User.findOne({ id: userId });
    if (user) {
      user.beautyFormSubmitted = true;
      user.beautyFormStatus = 'submitted';
      await user.save();
    }

    res.json({
      success: true,
      message: 'Treatment form submitted successfully! Our medical team will review your request.',
      treatmentForm: {
        id: treatmentForm._id,
        status: treatmentForm.status,
        submittedAt: treatmentForm.submittedAt,
      }
    });

  } catch (error) {
    console.error('Submit treatment form error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while submitting treatment form'
    });
  }
};

// @desc    Delete treatment form for current user
// @route   DELETE /api/treatment-form
// @access  Private
export const deleteTreatmentForm = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const treatmentForm = await TreatmentForm.findOneAndDelete({ userId });

    if (!treatmentForm) {
      return res.status(404).json({
        success: false,
        error: 'Treatment form not found'
      });
    }

    // Update user status
    const user = await User.findOne({ id: userId });
    if (user) {
      user.beautyFormSubmitted = false;
      user.beautyFormStatus = 'draft';
      await user.save();
    }

    res.json({
      success: true,
      message: 'Treatment form deleted successfully'
    });

  } catch (error) {
    console.error('Delete treatment form error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting treatment form'
    });
  }
};

// @desc    Get treatment form statistics (for admin)
// @route   GET /api/treatment-form/stats
// @access  Private (Admin only)
export const getTreatmentFormStats = async (req: Request, res: Response) => {
  try {
    const stats = await TreatmentForm.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalForms = await TreatmentForm.countDocuments();

    res.json({
      success: true,
      stats: {
        total: totalForms,
        byStatus: stats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {} as Record<string, number>)
      }
    });

  } catch (error) {
    console.error('Get treatment form stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching statistics'
    });
  }
};
