import express from 'express';
import { protect } from '../middleware/auth';
import Document from '../models/Document';
import User from '../models/User';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @desc    Upload or update a document
// @route   POST /api/documents
// @access  Private
router.post('/', async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { name, originalName, size, mimeType, category, fileData } = req.body;

    // Validate required fields
    if (!name || !originalName || !size || !mimeType || !category || !fileData) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    // Validate category
    const validCategories = ['consent_form', 'medical_history', 'id_proof', 'passport_copy'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid document category'
      });
    }

    // Find user
    const user = await User.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if document already exists for this category
    let document = await Document.findOne({ userId, category });

    if (document) {
      // Update existing document
      document.name = name;
      document.originalName = originalName;
      document.size = size;
      document.mimeType = mimeType;
      document.fileData = fileData;
      document.uploadedAt = new Date();
      await document.save();
    } else {
      // Create new document
      document = new Document({
        userId,
        user: user._id,
        name,
        originalName,
        size,
        mimeType,
        category,
        fileData,
      });
      await document.save();
    }

    res.json({
      success: true,
      message: 'Document uploaded successfully',
      document: {
        id: document._id,
        name: document.name,
        originalName: document.originalName,
        size: document.size,
        mimeType: document.mimeType,
        category: document.category,
        uploadedAt: document.uploadedAt,
      }
    });

  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while uploading document'
    });
  }
});

// @desc    Get all documents for current user
// @route   GET /api/documents
// @access  Private
router.get('/', async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const documents = await Document.find({ userId })
      .select('-fileData') // Don't send file data in list
      .sort({ uploadedAt: -1 });

    res.json({
      success: true,
      documents: documents.map(doc => ({
        id: doc._id,
        name: doc.name,
        originalName: doc.originalName,
        size: doc.size,
        mimeType: doc.mimeType,
        category: doc.category,
        uploadedAt: doc.uploadedAt,
      }))
    });

  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching documents'
    });
  }
});

// @desc    Get a specific document (including file data)
// @route   GET /api/documents/:id
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;

    const document = await Document.findOne({ _id: id, userId });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found'
      });
    }

    res.json({
      success: true,
      document: {
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
    console.error('Get document error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching document'
    });
  }
});

// @desc    Delete a document
// @route   DELETE /api/documents/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;

    const document = await Document.findOneAndDelete({ _id: id, userId });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found'
      });
    }

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });

  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting document'
    });
  }
});

export default router;

