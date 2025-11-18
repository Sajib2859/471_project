import mongoose, { Document, Schema } from 'mongoose';

export interface IAuction extends Document {
  title: string;
  description: string;
  materialType: string;
  quantity: number;
  unit: string;
  startingBid: number;
  currentBid: number;
  minimumCreditRequired: number;
  minimumCashRequired: number;
  startTime: Date;
  endTime: Date;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  winnerId?: mongoose.Types.ObjectId;
  location: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const auctionSchema = new Schema<IAuction>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  materialType: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  startingBid: { type: Number, required: true },
  currentBid: { type: Number, required: true },
  minimumCreditRequired: { type: Number, default: 0 },
  minimumCashRequired: { type: Number, default: 0 },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['scheduled', 'live', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  winnerId: { type: Schema.Types.ObjectId, ref: 'User' },
  location: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IAuction>('Auction', auctionSchema);
