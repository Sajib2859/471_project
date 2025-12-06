import mongoose, { Document, Schema } from 'mongoose';

export interface IWasteHub extends Document {
  name: string;
  location: {
    address: string;
    city: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  wasteTypes: string[]; // e.g., 'plastic', 'glass', 'paper', 'metal', 'organic', 'electronic'
  status: 'open' | 'closed' | 'maintenance';
  operatingHours: {
    open: string;
    close: string;
  };
  acceptedMaterials: {
    type: string;
    pricePerKg: number;
  }[];
  capacity: {
    current: number;
    maximum: number;
  };
  contactNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

const wasteHubSchema = new Schema<IWasteHub>(
  {
    name: { type: String, required: true },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      coordinates: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
      }
    },
    wasteTypes: {
      type: [String],
      required: true,
      enum: ['plastic', 'glass', 'paper', 'metal', 'organic', 'electronic', 'textile', 'hazardous']
    },
    status: {
      type: String,
      enum: ['open', 'closed', 'maintenance'],
      default: 'open'
    },
    operatingHours: {
      open: { type: String, required: true },
      close: { type: String, required: true }
    },
    acceptedMaterials: [
      {
        type: { type: String, required: true },
        pricePerKg: { type: Number, required: true }
      }
    ],
    capacity: {
      current: { type: Number, default: 0 },
      maximum: { type: Number, required: true }
    },
    contactNumber: { type: String, required: true }
  },
  { timestamps: true }
);

// Index for geospatial queries
wasteHubSchema.index({ 'location.coordinates': '2dsphere' });

export default mongoose.model<IWasteHub>('WasteHub', wasteHubSchema);
