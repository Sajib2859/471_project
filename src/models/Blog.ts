import mongoose, { Document, Schema } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  content: string;
  excerpt: string;
  category: 'recycling' | 'waste-management' | 'best-practices' | 'campaigns' | 'cleanup-news' | 'education';
  tags: string[];
  author: mongoose.Types.ObjectId;
  coverImage?: string;
  images: string[];
  status: 'draft' | 'published' | 'archived';
  views: number;
  likes: mongoose.Types.ObjectId[];
  comments: {
    user: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
  }[];
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlog>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  excerpt: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['recycling', 'waste-management', 'best-practices', 'campaigns', 'cleanup-news', 'education'],
    required: true 
  },
  tags: [{ type: String }],
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  coverImage: { type: String },
  images: [{ type: String }],
  status: { 
    type: String, 
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  views: { type: Number, default: 0 },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  publishedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

blogSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

export default mongoose.model<IBlog>('Blog', blogSchema);
