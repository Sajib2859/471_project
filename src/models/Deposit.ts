import mongoose, { Document, Schema } from "mongoose";

export interface IDeposit extends Document {
  userId: mongoose.Types.ObjectId;
  wasteHubId: mongoose.Types.ObjectId;
  wasteType: string; // plastic, glass, paper, metal, organic, electronic, textile, hazardous
  amount: number; // in kg
  description?: string;
  photoUrl?: string;
  status: "pending" | "verified" | "rejected";
  verificationDetails?: {
    verifiedBy: mongoose.Types.ObjectId; // Admin ID
    verifiedAt: Date;
    creditAllocated: number;
  };
  rejectionDetails?: {
    rejectedBy: mongoose.Types.ObjectId; // Admin ID
    rejectedAt: Date;
    reason: string;
  };
  estimatedCredits: number; // Calculated based on amount and waste type
  createdAt: Date;
  updatedAt: Date;
}

const depositSchema = new Schema<IDeposit>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    wasteHubId: {
      type: Schema.Types.ObjectId,
      ref: "WasteHub",
      required: true,
    },
    wasteType: {
      type: String,
      required: true,
      enum: [
        "plastic",
        "glass",
        "paper",
        "metal",
        "organic",
        "electronic",
        "textile",
        "hazardous",
      ],
    },
    amount: { type: Number, required: true, min: 0.1 },
    description: { type: String, default: "" },
    photoUrl: { type: String },
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    verificationDetails: {
      verifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
      verifiedAt: { type: Date },
      creditAllocated: { type: Number, default: 0 },
    },
    rejectionDetails: {
      rejectedBy: { type: Schema.Types.ObjectId, ref: "User" },
      rejectedAt: { type: Date },
      reason: { type: String },
    },
    estimatedCredits: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

// Index for efficient queries
depositSchema.index({ userId: 1, status: 1 });
depositSchema.index({ wasteHubId: 1, status: 1 });
depositSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model<IDeposit>("Deposit", depositSchema);
