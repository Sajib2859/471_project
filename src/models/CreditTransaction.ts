import mongoose, { Document, Schema } from 'mongoose';

export interface ICreditTransaction extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'earned' | 'spent' | 'redeemed';
  amount: number;
  description: string;
  referenceId?: mongoose.Types.ObjectId; // Reference to deposit, auction, etc.
  referenceType?: string; // 'deposit', 'auction', 'redemption'
  balanceAfter: number;
  createdAt: Date;
}

const creditTransactionSchema = new Schema<ICreditTransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['earned', 'spent', 'redeemed'],
      required: true
    },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    referenceId: { type: Schema.Types.ObjectId },
    referenceType: { type: String },
    balanceAfter: { type: Number, required: true }
  },
  { timestamps: true }
);

// Index for efficient queries
creditTransactionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<ICreditTransaction>('CreditTransaction', creditTransactionSchema);
