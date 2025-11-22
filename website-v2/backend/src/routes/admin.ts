import express from 'express';
import { requireAdmin } from '../middleware/auth';
import User from '../models/User';
import TreatmentForm from '../models/TreatmentForm';
import Document from '../models/Document';

const router = express.Router();

// All admin routes require admin authentication
router.use(requireAdmin);

// Get admin dashboard overview stats
router.get('/dashboard/stats', async (req, res) => {
  try {
    // Get user stats
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const usersWithForms = await User.countDocuments({ beautyFormSubmitted: true });

    // Get form stats
    const totalForms = await TreatmentForm.countDocuments();
    const submittedForms = await TreatmentForm.countDocuments({ status: 'submitted' });
    const underReviewForms = await TreatmentForm.countDocuments({ status: 'under_review' });
    const approvedForms = await TreatmentForm.countDocuments({ status: 'approved' });
    const rejectedForms = await TreatmentForm.countDocuments({ status: 'rejected' });

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    const recentForms = await TreatmentForm.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          verified: verifiedUsers,
          withForms: usersWithForms,
          recent: recentUsers
        },
        forms: {
          total: totalForms,
          submitted: submittedForms,
          underReview: underReviewForms,
          approved: approvedForms,
          rejected: rejectedForms,
          recent: recentForms
        }
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Get all users with pagination and filtering
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filter: any = {};

    // Add filters based on query params
    if (req.query.verified === 'true') filter.isVerified = true;
    if (req.query.verified === 'false') filter.isVerified = false;
    if (req.query.hasForm === 'true') filter.beautyFormSubmitted = true;
    if (req.query.hasForm === 'false') filter.beautyFormSubmitted = false;
    if (req.query.search) {
      filter.$or = [
        { fullName: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password -emailVerificationToken -emailVerificationExpires')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Get all treatment forms with pagination and filtering
router.get('/forms', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filter: any = {};

    // Add filters based on query params
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) {
      // Search in user data through population
      const searchUsers = await User.find({
        $or: [
          { fullName: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } }
        ]
      }).select('id');

      filter.$or = [
        { userId: { $in: searchUsers.map(u => u.id) } }
      ];
    }

    const forms = await TreatmentForm.find(filter)
      .populate('user', 'fullName email phone country')
      .sort({ lastModifiedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await TreatmentForm.countDocuments(filter);

    res.json({
      success: true,
      data: {
        forms,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching forms:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Update form status (approve/reject)
router.patch('/forms/:formId/status', async (req, res) => {
  try {
    const { formId } = req.params;
    const { status, notes } = req.body;

    if (!['approved', 'rejected', 'under_review'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
    }

    const form = await TreatmentForm.findById(formId);
    if (!form) {
      return res.status(404).json({
        success: false,
        error: 'Form not found'
      });
    }

    form.status = status;
    form.lastModifiedAt = new Date();

    // If approving, update user's form status
    if (status === 'approved') {
      await User.findOneAndUpdate(
        { id: form.userId },
        { beautyFormStatus: 'approved' }
      );
    } else if (status === 'rejected') {
      await User.findOneAndUpdate(
        { id: form.userId },
        { beautyFormStatus: 'rejected' }
      );
    }

    await form.save();

    res.json({
      success: true,
      data: form
    });
  } catch (error) {
    console.error('Error updating form status:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Get user details with their form and documents
router.get('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ id: userId })
      .select('-password -emailVerificationToken -emailVerificationExpires')
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const form = await TreatmentForm.findOne({ userId })
      .populate('user', 'fullName email')
      .lean();

    res.json({
      success: true,
      data: {
        user,
        form
      }
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Update user role (promote/demote to admin)
router.patch('/users/:userId/role', async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid role'
      });
    }

    const user = await User.findOneAndUpdate(
      { id: userId },
      { role },
      { new: true }
    ).select('-password -emailVerificationToken -emailVerificationExpires');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Get all documents with user information
router.get('/documents', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filter: any = {};

    // Add search filter
    if (req.query.search) {
      const searchUsers = await User.find({
        $or: [
          { fullName: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } }
        ]
      }).select('id');

      filter.userId = { $in: searchUsers.map(u => u.id) };
    }

    // Get all documents grouped by user
    const documents = await Document.find(filter)
      .populate('user', 'fullName email phone country')
      .sort({ uploadedAt: -1 })
      .lean();

    // Group documents by user
    const userDocumentsMap = new Map<string, any>();
    
    for (const doc of documents) {
      const userId = doc.userId;
      if (!userDocumentsMap.has(userId)) {
        userDocumentsMap.set(userId, {
          userId,
          user: doc.user,
          documents: []
        });
      }
      userDocumentsMap.get(userId).documents.push({
        id: doc._id,
        name: doc.name,
        originalName: doc.originalName,
        size: doc.size,
        mimeType: doc.mimeType,
        category: doc.category,
        uploadedAt: doc.uploadedAt,
      });
    }

    const userDocuments = Array.from(userDocumentsMap.values());

    // Calculate statistics
    const requiredCategories = ['consent_form', 'medical_history', 'id_proof'];
    const stats = {
      complete: 0,
      partial: 0,
      none: 0
    };

    userDocuments.forEach(ud => {
      const uploadedRequired = requiredCategories.filter(cat =>
        ud.documents.some((doc: any) => doc.category === cat)
      ).length;

      if (uploadedRequired === 3) stats.complete++;
      else if (uploadedRequired > 0) stats.partial++;
      else stats.none++;
    });

    res.json({
      success: true,
      data: {
        userDocuments: userDocuments.slice(skip, skip + limit),
        stats,
        pagination: {
          page,
          limit,
          total: userDocuments.length,
          pages: Math.ceil(userDocuments.length / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Get documents for a specific user
router.get('/documents/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const documents = await Document.find({ userId })
      .sort({ uploadedAt: -1 })
      .lean();

    res.json({
      success: true,
      data: {
        documents: documents.map(doc => ({
          id: doc._id,
          name: doc.name,
          originalName: doc.originalName,
          size: doc.size,
          mimeType: doc.mimeType,
          category: doc.category,
          uploadedAt: doc.uploadedAt,
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching user documents:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Download a specific document
router.get('/documents/:userId/:documentId', async (req, res) => {
  try {
    const { userId, documentId } = req.params;

    const document = await Document.findOne({ _id: documentId, userId });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: document._id,
        name: document.name,
        originalName: document.originalName,
        size: document.size,
        mimeType: document.mimeType,
        category: document.category,
        fileData: document.fileData,
        uploadedAt: document.uploadedAt,
      }
    });
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

export default router;
