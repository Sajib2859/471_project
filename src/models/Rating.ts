import mongoose, { Document, Schema } from 'mongoose';

export interface IRating extends Document {
  userId: mongoose.Types.ObjectId;
  userName: string;
  targetType: 'wastehub' | 'company';
  targetId: mongoose.Types.ObjectId;
  targetName: string;
  rating: number; // 1-5 stars
  review?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RatingSchema = new Schema<IRating>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    targetType: {
      type: String,
      enum: ['wastehub', 'company'],
      required: true
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'targetType'
    },
    targetName: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    review: {
      type: String,
      maxlength: 500
    }
  },
  {
    timestamps: true
  }
);

// Indexes for efficient queries
RatingSchema.index({ targetId: 1, targetType: 1 });
RatingSchema.index({ userId: 1 });
RatingSchema.index({ rating: -1 });

export default mongoose.model<IRating>('Rating', RatingSchema);
