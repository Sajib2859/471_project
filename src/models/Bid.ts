import mongoose, { Document, Schema } from 'mongoose';

export interface IBid extends Document {
  auctionId: mongoose.Types.ObjectId;
  bidderId: mongoose.Types.ObjectId;
  bidAmount: number;
  bidType: 'credit' | 'cash';
  status: 'active' | 'outbid' | 'won' | 'lost';
  createdAt: Date;
}

const bidSchema = new Schema<IBid>({
  auctionId: { type: Schema.Types.ObjectId, ref: 'Auction', required: true },
  bidderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  bidAmount: { type: Number, required: true },
  bidType: { type: String, enum: ['credit', 'cash'], required: true },
  status: { 
    type: String, 
    enum: ['active', 'outbid', 'won', 'lost'],
    default: 'active'
  },
  createdAt: { type: Date, default: Date.now }
});

// Index for faster queries
bidSchema.index({ auctionId: 1, createdAt: -1 });
bidSchema.index({ bidderId: 1 });

export default mongoose.model<IBid>('Bid', bidSchema);
