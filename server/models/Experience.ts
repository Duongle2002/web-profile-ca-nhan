import mongoose from 'mongoose';

const ExperienceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  company: { type: String, required: true },
  duration: { type: String },
  description: { type: String },
  skills: [{ type: String }],
  type: { type: String, enum: ['work', 'education', 'activity'], default: 'work' },
  details: [{ type: String }]
}, { timestamps: true });

export const Experience = mongoose.model('Experience', ExperienceSchema);
