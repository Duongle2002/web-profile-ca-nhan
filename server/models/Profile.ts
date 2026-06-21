import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  title: { type: String, required: true },
  tagline: { type: String, required: true },
  aboutShort: { type: String },
  aboutLong: { type: String },
  location: { type: String },
  email: { type: String },
  github: { type: String },
  linkedin: { type: String },
  twitter: { type: String },
  facebook: { type: String, default: '' },
  zalo: { type: String, default: '' },
  tiktok: { type: String, default: '' },
  youtube: { type: String, default: '' },
  showGithub: { type: Boolean, default: true },
  showLinkedin: { type: Boolean, default: true },
  showFacebook: { type: Boolean, default: false },
  showZalo: { type: Boolean, default: false },
  showTiktok: { type: Boolean, default: false },
  showYoutube: { type: Boolean, default: false },
  status: {
    text: { type: String },
    type: { type: String, enum: ['active', 'idle', 'busy'], default: 'active' }
  }
}, { timestamps: true });

export const Profile = mongoose.model('Profile', ProfileSchema);
