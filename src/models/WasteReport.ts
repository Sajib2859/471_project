import mongoose, { Document, Schema } from 'mongoose';

export interface IWasteReport extends Document {
  title: string;
  description: string;
  location: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  wasteTypes: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  estimatedQuantity?: number;
  unit?: string;
  photos: string[];
  status: 'pending' | 'verified' | 'in-progress' | 'resolved' | 'rejected';
  reportedBy: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId;
  verifiedBy?: mongoose.Types.ObjectId;
  verifiedAt?: Date;
  resolvedAt?: Date;
  notes: string[];
  upvotes: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const wasteReportSchema = new Schema<IWasteReport>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  coordinates: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  wasteTypes: [{ type: String, required: true }],
  severity: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  estimatedQuantity: { type: Number },
  unit: { type: String, default: 'kg' },
  photos: [{ type: String }],
  status: { 
    type: String, 
    enum: ['pending', 'verified', 'in-progress', 'resolved', 'rejected'],
    default: 'pending'
  },
  reportedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  verifiedAt: { type: Date },
  resolvedAt: { type: Date },
  notes: [{ type: String }],
  upvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

wasteReportSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<IWasteReport>('WasteReport', wasteReportSchema);
