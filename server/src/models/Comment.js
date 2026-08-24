import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
  authorId: { type: String, required: true },
  authorName: { type: String, required: true },
  text: { type: String, required: true, trim: true, maxlength: 1000 }
}, { timestamps: true });

export default mongoose.model('Comment', commentSchema);
