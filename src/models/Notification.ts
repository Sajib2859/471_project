import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  recipientId: mongoose.Types.ObjectId;
  type: 'auction_match' | 'inventory_match' | 'price_alert' | 'bid_update' | 'auction_won';
  title: string;
  message: string;
  relatedId?: mongoose.Types.ObjectId;
  relatedType?: 'auction' | 'requirement' | 'bid';
  isRead: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>({
  recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['auction_match', 'inventory_match', 'price_alert', 'bid_update', 'auction_won'],
    required: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  relatedId: { type: Schema.Types.ObjectId },
  relatedType: { type: String, enum: ['auction', 'requirement', 'bid'] },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Index for user notifications
notificationSchema.index({ recipientId: 1, createdAt: -1 });

export default mongoose.model<INotification>('Notification', notificationSchema);
