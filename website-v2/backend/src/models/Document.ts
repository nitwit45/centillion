import mongoose, { Document as MongooseDocument, Schema } from 'mongoose';

export interface IDocument extends MongooseDocument {
  userId: string;
  user: mongoose.Types.ObjectId;
  name: string;
  originalName: string;
  size: number;
  mimeType: string;
  category: 'consent_form' | 'medical_history' | 'id_proof' | 'passport_copy';
  fileData: string; // Base64 encoded file data
  uploadedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['consent_form', 'medical_history', 'id_proof', 'passport_copy'],
  },
  fileData: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Create compound index for userId and category to ensure one document per category per user
DocumentSchema.index({ userId: 1, category: 1 });

export default mongoose.model<IDocument>('Document', DocumentSchema);

