import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  subtitle: { type: String },
  description: { type: String },
  longDescription: { type: String },
  tags: [{ type: String }],
  category: { type: String, enum: ['web', 'mobile', 'ai', 'design'], default: 'web' },
  stats: [{
    label: { type: String },
    value: { type: String }
  }],
  image: { type: String },
  demoUrl: { type: String, default: '#' },
  githubUrl: { type: String, default: '#' },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

export const Project = mongoose.model('Project', ProjectSchema);
