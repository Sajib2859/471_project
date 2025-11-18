import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  role: 'user' | 'admin' | 'company';
  creditBalance: number;
  cashBalance: number;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['user', 'admin', 'company'], default: 'user' },
  creditBalance: { type: Number, default: 0 },
  cashBalance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', userSchema);
