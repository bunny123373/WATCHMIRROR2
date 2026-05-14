import mongoose, { Schema, Document } from "mongoose";

export interface IMuxTokenDocument extends Document {
  label: string;
  tokenId: string;
  tokenSecret: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const MuxTokenSchema = new Schema({
  label: { type: String, required: true },
  tokenId: { type: String, required: true },
  tokenSecret: { type: String, required: true },
}, {
  timestamps: true,
});

export const MuxToken = mongoose.models.MuxToken || mongoose.model<IMuxTokenDocument>("MuxToken", MuxTokenSchema);
