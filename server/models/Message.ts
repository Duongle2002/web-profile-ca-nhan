import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  emoji: { type: String, default: '☕' },
  avatarSeed: { type: Number, default: 1 }
}, { timestamps: true });

export const Message = mongoose.model('Message', MessageSchema);
