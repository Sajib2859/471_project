import mongoose, { Document, Schema } from 'mongoose';

export interface IAnnouncement extends Document {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  targetAudience: 'all' | 'user' | 'company' | 'admin';
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdByName: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    title: {
      type: String,
      required: true,
      maxlength: 200
    },
    message: {
      type: String,
      required: true,
      maxlength: 1000
    },
    type: {
      type: String,
      enum: ['info', 'warning', 'success', 'error'],
      default: 'info'
    },
    targetAudience: {
      type: String,
      enum: ['all', 'user', 'company', 'admin'],
      default: 'all'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdByName: {
      type: String,
      required: true
    },
    expiresAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Indexes
AnnouncementSchema.index({ isActive: 1, targetAudience: 1 });
AnnouncementSchema.index({ expiresAt: 1 });

export default mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);
