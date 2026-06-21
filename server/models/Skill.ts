import mongoose from 'mongoose';

const SkillSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  skills: [{
    name: { type: String, required: true },
    level: { type: Number, required: true, min: 0, max: 100 },
    iconName: { type: String, default: 'Zap' }
  }]
}, { timestamps: true });

export const Skill = mongoose.model('Skill', SkillSchema);
