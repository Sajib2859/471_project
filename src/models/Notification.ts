import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  recipientId: mongoose.Types.ObjectId;
  type: 'deposit_validation' | 'campaign_update' | 'auction_activity' | 'direct_message' | 'credit_redemption' | 
        'auction_match' | 'inventory_match' | 'price_alert' | 'bid_update' | 'auction_won';
  title: string;
  message: string;
  relatedId?: mongoose.Types.ObjectId;
  relatedType?: 'auction' | 'requirement' | 'bid' | 'deposit' | 'campaign' | 'credit' | 'message';
  isRead: boolean;
  priority?: 'low' | 'medium' | 'high';
  metadata?: Record<string, any>;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>({
  recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['deposit_validation', 'campaign_update', 'auction_activity', 'direct_message', 'credit_redemption',
           'auction_match', 'inventory_match', 'price_alert', 'bid_update', 'auction_won'],
    required: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  relatedId: { type: Schema.Types.ObjectId },
  relatedType: { type: String, enum: ['auction', 'requirement', 'bid', 'deposit', 'campaign', 'credit', 'message'] },
  isRead: { type: Boolean, default: false },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  metadata: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
});

// Indexes for efficient queries
notificationSchema.index({ recipientId: 1, createdAt: -1 });
notificationSchema.index({ recipientId: 1, isRead: 1 });
notificationSchema.index({ type: 1 });

export default mongoose.model<INotification>('Notification', notificationSchema);
