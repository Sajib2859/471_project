import mongoose, { Document, Schema } from 'mongoose';

export interface ICreditRedemption extends Document {
  userId: mongoose.Types.ObjectId;
  creditsRedeemed: number;
  cashAmount: number;
  conversionRate: number; // Credits to cash ratio
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  paymentMethod: 'bank_transfer' | 'mobile_banking' | 'cash';
  paymentDetails?: {
    accountNumber?: string;
    accountName?: string;
    bankName?: string;
    mobileNumber?: string;
  };
  processedBy?: mongoose.Types.ObjectId; // Admin who processed
  processedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const creditRedemptionSchema = new Schema<ICreditRedemption>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    creditsRedeemed: { type: Number, required: true },
    cashAmount: { type: Number, required: true },
    conversionRate: { type: Number, required: true, default: 1 }, // 1 credit = 1 unit of currency
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'rejected'],
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      enum: ['bank_transfer', 'mobile_banking', 'cash'],
      required: true
    },
    paymentDetails: {
      accountNumber: String,
      accountName: String,
      bankName: String,
      mobileNumber: String
    },
    processedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    processedAt: Date,
    rejectionReason: String
  },
  { timestamps: true }
);

// Index for efficient queries
creditRedemptionSchema.index({ userId: 1, status: 1 });

export default mongoose.model<ICreditRedemption>('CreditRedemption', creditRedemptionSchema);
