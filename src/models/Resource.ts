import mongoose, { Schema, Document } from 'mongoose';

export interface IResource extends Omit<Document, 'model'> {
  name: string;
  category: 'Driver' | 'Software' | 'Document';
  brand: string;
  model: string;
  googleDriveFileId: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true, enum: ['Driver', 'Software', 'Document'] },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    googleDriveFileId: { type: String, required: true, unique: true },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Resource || mongoose.model<IResource>('Resource', ResourceSchema);
