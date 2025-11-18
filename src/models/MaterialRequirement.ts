import mongoose, { Document, Schema } from 'mongoose';

export interface IMaterialRequirement extends Document {
  companyId: mongoose.Types.ObjectId;
  materialType: string;
  quantity: number;
  unit: string;
  description: string;
  maxPrice: number;
  urgency: 'low' | 'medium' | 'high';
  status: 'active' | 'fulfilled' | 'cancelled';
  preferredLocations: string[];
  notificationPreferences: {
    auctionMatch: boolean;
    inventoryMatch: boolean;
    priceAlert: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const materialRequirementSchema = new Schema<IMaterialRequirement>({
  companyId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  materialType: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  description: { type: String, required: true },
  maxPrice: { type: Number, required: true },
  urgency: { 
    type: String, 
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: { 
    type: String, 
    enum: ['active', 'fulfilled', 'cancelled'],
    default: 'active'
  },
  preferredLocations: [{ type: String }],
  notificationPreferences: {
    auctionMatch: { type: Boolean, default: true },
    inventoryMatch: { type: Boolean, default: true },
    priceAlert: { type: Boolean, default: true }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index for matching queries
materialRequirementSchema.index({ materialType: 1, status: 1 });
materialRequirementSchema.index({ companyId: 1 });

export default mongoose.model<IMaterialRequirement>('MaterialRequirement', materialRequirementSchema);
