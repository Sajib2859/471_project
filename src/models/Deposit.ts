import mongoose, { Document, Schema } from 'mongoose';

export interface IDeposit extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  hubId: mongoose.Schema.Types.ObjectId;
  wasteType: string; // e.g., 'plastic', 'glass', 'paper', 'metal', 'organic', 'electronic', 'textile', 'hazardous'
  quantity: number;
  unit: string; // 'kg', 'liters', 'pieces'
  isRecyclable: boolean;
  description?: string;
  status: 'pending' | 'accepted' | 'rejected';
  creditsEarned: number;
  depositDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const depositSchema = new Schema<IDeposit>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    hubId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WasteHub',
      required: true
    },
    wasteType: {
      type: String,
      required: true,
      enum: ['plastic', 'glass', 'paper', 'metal', 'organic', 'electronic', 'textile', 'hazardous']
    },
    quantity: {
      type: Number,
      required: true,
      min: [0.1, 'Quantity must be greater than 0']
    },
    unit: {
      type: String,
      required: true,
      enum: ['kg', 'liters', 'pieces'],
      default: 'kg'
    },
    isRecyclable: {
      type: Boolean,
      required: true,
      default: true
    },
    description: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    creditsEarned: {
      type: Number,
      default: 0,
      min: 0
    },
    depositDate: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default mongoose.model<IDeposit>('Deposit', depositSchema);
