import mongoose, { Document, Schema } from 'mongoose';

export interface IActivityLog extends Document {
  userId: mongoose.Types.ObjectId;
  userName: string;
  userRole: 'user' | 'company' | 'admin';
  action: string;
  actionType: 'create' | 'update' | 'delete' | 'view' | 'login' | 'logout' | 'export' | 'approve' | 'reject';
  resourceType: 'user' | 'deposit' | 'campaign' | 'auction' | 'blog' | 'waste-hub' | 'material-requirement' | 'waste-report' | 'credit' | 'role' | 'analytics';
  resourceId?: mongoose.Types.ObjectId;
  details?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

const activityLogSchema = new Schema<IActivityLog>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  userRole: { type: String, enum: ['user', 'company', 'admin'], required: true },
  action: { type: String, required: true },
  actionType: { 
    type: String, 
    enum: ['create', 'update', 'delete', 'view', 'login', 'logout', 'export', 'approve', 'reject'],
    required: true
  },
  resourceType: { 
    type: String, 
    enum: ['user', 'deposit', 'campaign', 'auction', 'blog', 'waste-hub', 'material-requirement', 'waste-report', 'credit', 'role', 'analytics'],
    required: true
  },
  resourceId: { type: Schema.Types.ObjectId },
  details: { type: String },
  metadata: { type: Schema.Types.Mixed },
  ipAddress: { type: String },
  userAgent: { type: String },
  timestamp: { type: Date, default: Date.now }
});

// Indexes for efficient queries
activityLogSchema.index({ userId: 1, timestamp: -1 });
activityLogSchema.index({ userRole: 1, timestamp: -1 });
activityLogSchema.index({ actionType: 1, timestamp: -1 });
activityLogSchema.index({ resourceType: 1, timestamp: -1 });
activityLogSchema.index({ timestamp: -1 });

export default mongoose.model<IActivityLog>('ActivityLog', activityLogSchema);
