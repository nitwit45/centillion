import mongoose, { Document, Schema } from 'mongoose';

export interface ITreatmentForm extends Document {
  userId: string;
  user: mongoose.Types.ObjectId;

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

  // Status and metadata
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  submittedAt?: Date;
  lastModifiedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TreatmentFormSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // Personal Info
  dateOfBirth: {
    type: String,
    required: false,
  },
  gender: {
    type: String,
    required: false,
    enum: ['Female', 'Male', 'Transgender', 'Prefer not to say'],
  },
  occupation: {
    type: String,
    required: false,
  },

  // Purpose of Visit
  purposeOfVisit: [{
    type: String,
    enum: [
      'Cosmetic Surgery',
      'Non-Surgical Beauty Treatment',
      'Wellness & Detox Program',
      'Gender-Affirming or Transgender Transformation',
      'Rejuvenation / Anti-Aging Package'
    ]
  }],

  // Surgical Treatments
  facialSurgeries: [{
    type: String,
    enum: [
      'Facelift',
      'Eyelid Surgery (Blepharoplasty)',
      'Brow Lift',
      'Rhinoplasty (Nose Reshaping)',
      'Chin or Jawline Contouring',
      'Neck Lift',
      'Ear Correction (Otoplasty)'
    ]
  }],
  bodyContouring: [{
    type: String,
    enum: [
      'Liposuction',
      'Tummy Tuck (Abdominoplasty)',
      'Arm Lift',
      'Thigh Lift',
      'Body Sculpting / Fat Transfer'
    ]
  }],
  breastChest: [{
    type: String,
    enum: [
      'Breast Augmentation',
      'Breast Lift / Firming',
      'Breast Reduction',
      'Male Chest Sculpting / Gynecomastia Surgery'
    ]
  }],
  buttocksHips: [{
    type: String,
    enum: [
      'Buttock Lift / Firming',
      'Brazilian Butt Lift (BBL)',
      'Fat Transfer to Hips'
    ]
  }],

  // Non-Surgical Treatments
  facialSkin: [{
    type: String,
    enum: [
      'Botox',
      'Dermal Fillers',
      'PRP (Platelet Rich Plasma) Therapy',
      'Thread Lift',
      'Laser Skin Rejuvenation',
      'Chemical Peel',
      'Acne / Scar Treatment',
      'Pigmentation / Whitening Treatment'
    ]
  }],
  bodyShape: [{
    type: String,
    enum: [
      'Cryolipolysis (Fat Freeze)',
      'Body Sculpting (Ultrasound / RF)',
      'Skin Tightening & Firming',
      'Stretch Mark Removal',
      'Cellulite Reduction'
    ]
  }],
  hairAntiAging: [{
    type: String,
    enum: [
      'Hair Transplant / Hair PRP',
      'Anti-Aging Injection / IV Therapy',
      'Mesotherapy',
      'Wellness Detox & Recovery Retreat'
    ]
  }],

  // Transgender Treatments
  transgenderTreatments: [{
    type: String,
    enum: [
      'Facial Feminisation / Masculinisation Surgery',
      'Breast / Chest Enhancement',
      'Body Sculpting / Liposuction',
      'Voice or Adam\'s Apple Surgery',
      'Hairline / Hair Transplant Treatment',
      'Hormonal or Skin-Feminising Treatments'
    ]
  }],

  // Additional Information
  previousProcedures: {
    type: Boolean,
    default: false,
  },
  previousProceduresDetails: {
    type: String,
    required: false,
  },
  medicalConditions: {
    type: String,
    required: false,
  },
  preferredMonth: {
    type: String,
    required: false,
  },
  includeSightseeing: {
    type: Boolean,
    default: false,
  },

  // Status and metadata
  status: {
    type: String,
    enum: ['draft', 'submitted', 'under_review', 'approved', 'rejected'],
    default: 'draft',
  },
  submittedAt: {
    type: Date,
    required: false,
  },
  lastModifiedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Update lastModifiedAt before saving
TreatmentFormSchema.pre('save', function(next) {
  this.lastModifiedAt = new Date();
  next();
});

export default mongoose.model<ITreatmentForm>('TreatmentForm', TreatmentFormSchema);
