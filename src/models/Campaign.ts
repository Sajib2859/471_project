import mongoose, { Document, Schema } from 'mongoose';

export interface ICampaign extends Document {
  title: string;
  description: string;
  campaignType: 'cleanup' | 'waste-management' | 'awareness' | 'recycling';
  location: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  startDate: Date;
  endDate: Date;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  maxParticipants?: number;
  participants: mongoose.Types.ObjectId[];
  followers: mongoose.Types.ObjectId[];
  volunteers: mongoose.Types.ObjectId[];
  organizer: mongoose.Types.ObjectId;
  progress: number; // 0-100
  goals: string[];
  achievements: string[];
  images: string[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const campaignSchema = new Schema<ICampaign>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  campaignType: { 
    type: String, 
    enum: ['cleanup', 'waste-management', 'awareness', 'recycling'],
    required: true 
  },
  location: { type: String, required: true },
  coordinates: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  maxParticipants: { type: Number },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  volunteers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  organizer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  goals: [{ type: String }],
  achievements: [{ type: String }],
  images: [{ type: String }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

campaignSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<ICampaign>('Campaign', campaignSchema);
