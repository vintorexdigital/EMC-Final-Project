import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  ownerId: { type: String, required: true, index: true },
  ownerName: { type: String, required: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, required: true, trim: true, maxlength: 5000 },
  tags: [{ type: String, trim: true, lowercase: true }],
  githubUrl: { type: String, required: true, trim: true },
  liveDemoUrl: { type: String, trim: true, default: '' }
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);
