import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, isUsingMongo } from './config/db';
import { getLocalDBData, saveLocalDBData, LocalDBStructure } from './config/fallbackDb';

// Import Models for MongoDB
import { Profile } from './models/Profile';
import { Project } from './models/Project';
import { Experience } from './models/Experience';
import { Skill } from './models/Skill';
import { Message } from './models/Message';

// Import Default static data for seeding
import { PERSONAL_INFO, PROJECTS, EXPERIENCES, SKILL_CATEGORIES, MOCK_MESSAGES } from '../src/data';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Initialize Database Connection
connectDB().then(async () => {
  if (isUsingMongo) {
    try {
      // Auto-seed MongoDB if collections are empty
      const profileCount = await Profile.countDocuments();
      if (profileCount === 0) {
        await new Profile(PERSONAL_INFO).save();
        console.log('🌱 MongoDB auto-seeded: Profile.');
      }
      
      const projectCount = await Project.countDocuments();
      if (projectCount === 0) {
        await Project.insertMany(PROJECTS);
        console.log('🌱 MongoDB auto-seeded: Projects.');
      }
      
      const expCount = await Experience.countDocuments();
      if (expCount === 0) {
        await Experience.insertMany(EXPERIENCES);
        console.log('🌱 MongoDB auto-seeded: Experiences.');
      }
      
      const skillCount = await Skill.countDocuments();
      if (skillCount === 0) {
        await Skill.insertMany(SKILL_CATEGORIES);
        console.log('🌱 MongoDB auto-seeded: Skills.');
      }
      
      const messageCount = await Message.countDocuments();
      if (messageCount === 0) {
        await Message.insertMany(MOCK_MESSAGES);
        console.log('🌱 MongoDB auto-seeded: Guestbook Messages.');
      }
      console.log('🚀 MongoDB Auto-seeding completed.');
    } catch (err) {
      console.error('Lỗi tự động seeding MongoDB:', err);
    }
  }
});

// Admin Authorization Middleware
const authAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin';

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Không tìm thấy thông tin xác thực Admin.' });
  }

  const token = authHeader.split(' ')[1];
  if (token !== adminPassword) {
    return res.status(401).json({ message: 'Mật khẩu quản trị không đúng.' });
  }
  next();
};

// -------------------------------------------------------------
// API ENDPOINTS
// -------------------------------------------------------------

// 1. PROFILE ENDPOINTS
app.get('/api/profile', async (req, res) => {
  try {
    if (isUsingMongo) {
      const profile = await Profile.findOne();
      return res.json(profile || PERSONAL_INFO);
    } else {
      const data = getLocalDBData();
      return res.json(data.profile);
    }
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy dữ liệu profile.', error: (err as Error).message });
  }
});

app.post('/api/profile', authAdmin, async (req, res) => {
  try {
    if (isUsingMongo) {
      let profile = await Profile.findOne();
      if (profile) {
        Object.assign(profile, req.body);
        await profile.save();
      } else {
        profile = new Profile(req.body);
        await profile.save();
      }
      return res.json(profile);
    } else {
      const data = getLocalDBData();
      data.profile = req.body;
      saveLocalDBData(data);
      return res.json(data.profile);
    }
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật profile.', error: (err as Error).message });
  }
});

// 2. PROJECTS ENDPOINTS
app.get('/api/projects', async (req, res) => {
  try {
    if (isUsingMongo) {
      const projects = await Project.find();
      return res.json(projects);
    } else {
      const data = getLocalDBData();
      return res.json(data.projects);
    }
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy danh sách dự án.', error: (err as Error).message });
  }
});

app.post('/api/projects', authAdmin, async (req, res) => {
  try {
    const newProjects = req.body;
    if (!Array.isArray(newProjects)) {
      return res.status(400).json({ message: 'Dữ liệu dự án phải là một mảng.' });
    }

    if (isUsingMongo) {
      await Project.deleteMany({});
      const projects = await Project.insertMany(newProjects);
      return res.json(projects);
    } else {
      const data = getLocalDBData();
      data.projects = newProjects;
      saveLocalDBData(data);
      return res.json(data.projects);
    }
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật danh sách dự án.', error: (err as Error).message });
  }
});

// 3. EXPERIENCES ENDPOINTS
app.get('/api/experiences', async (req, res) => {
  try {
    if (isUsingMongo) {
      const experiences = await Experience.find();
      return res.json(experiences);
    } else {
      const data = getLocalDBData();
      return res.json(data.experiences);
    }
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy danh sách kinh nghiệm.', error: (err as Error).message });
  }
});

app.post('/api/experiences', authAdmin, async (req, res) => {
  try {
    const newExperiences = req.body;
    if (!Array.isArray(newExperiences)) {
      return res.status(400).json({ message: 'Dữ liệu hành trình phải là một mảng.' });
    }

    if (isUsingMongo) {
      await Experience.deleteMany({});
      const experiences = await Experience.insertMany(newExperiences);
      return res.json(experiences);
    } else {
      const data = getLocalDBData();
      data.experiences = newExperiences;
      saveLocalDBData(data);
      return res.json(data.experiences);
    }
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật danh sách hành trình.', error: (err as Error).message });
  }
});

// 4. SKILLS ENDPOINTS
app.get('/api/skills', async (req, res) => {
  try {
    if (isUsingMongo) {
      const skills = await Skill.find();
      return res.json(skills);
    } else {
      const data = getLocalDBData();
      return res.json(data.skills);
    }
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy danh sách kỹ năng.', error: (err as Error).message });
  }
});

app.post('/api/skills', authAdmin, async (req, res) => {
  try {
    const newSkills = req.body;
    if (!Array.isArray(newSkills)) {
      return res.status(400).json({ message: 'Dữ liệu kỹ năng phải là một mảng.' });
    }

    if (isUsingMongo) {
      await Skill.deleteMany({});
      const skills = await Skill.insertMany(newSkills);
      return res.json(skills);
    } else {
      const data = getLocalDBData();
      data.skills = newSkills;
      saveLocalDBData(data);
      return res.json(data.skills);
    }
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật danh sách kỹ năng.', error: (err as Error).message });
  }
});

// Helper: Gửi thông báo Telegram khi có lưu bút mới
const sendTelegramNotification = async (msg: any) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId || botToken.trim() === '' || chatId.trim() === '') {
    return; // Chưa cấu hình Telegram, bỏ qua
  }

  const emoji = msg.emoji || '💬';
  const name = msg.name || 'Ẩn danh';
  const email = msg.email || 'Không có email';
  const message = msg.message || '';
  const time = new Date(msg.timestamp || Date.now()).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

  const text = [
    `🔔 *LƯU BÚT MỚI TRÊN PORTFOLIO!*`,
    ``,
    `${emoji} *${name}*`,
    `📧 ${email}`,
    `🕐 ${time}`,
    ``,
    `💬 _"${message}"_`,
    ``,
    `👉 Xem tại: ${process.env.APP_URL || 'http://localhost:3001'}/#guestbook`
  ].join('\n');

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
        disable_web_page_preview: true
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn('⚠️  Telegram notification failed:', errText);
    } else {
      console.log('📨 Telegram notification sent!');
    }
  } catch (err) {
    console.warn('⚠️  Lỗi gửi Telegram notification:', (err as Error).message);
  }
};

// 5. GUESTBOOK ENDPOINTS
app.get('/api/guestbook', async (req, res) => {
  try {
    if (isUsingMongo) {
      const messages = await Message.find().sort({ timestamp: -1 });
      return res.json(messages);
    } else {
      const data = getLocalDBData();
      // Sort messages descending by timestamp
      const sorted = [...data.guestbook].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      return res.json(sorted);
    }
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy danh sách lưu bút.', error: (err as Error).message });
  }
});

app.post('/api/guestbook', async (req, res) => {
  try {
    const msgData = req.body;
    let savedMsg = msgData;

    if (isUsingMongo) {
      const newMessage = new Message(msgData);
      await newMessage.save();
      savedMsg = newMessage;
      res.status(201).json(newMessage);
    } else {
      const data = getLocalDBData();
      data.guestbook.unshift(msgData);
      saveLocalDBData(data);
      res.status(201).json(msgData);
    }

    // Gửi thông báo Telegram (async, không block response)
    sendTelegramNotification(savedMsg).catch(() => {});
  } catch (err) {
    res.status(500).json({ message: 'Lỗi gửi lưu bút.', error: (err as Error).message });
  }
});

// 6. RESET DATA TO DEFAULT (Admin Only)
app.post('/api/reset', authAdmin, async (req, res) => {
  try {
    if (isUsingMongo) {
      await Profile.deleteMany({});
      await new Profile(PERSONAL_INFO).save();
      
      await Project.deleteMany({});
      await Project.insertMany(PROJECTS);
      
      await Experience.deleteMany({});
      await Experience.insertMany(EXPERIENCES);
      
      await Skill.deleteMany({});
      await Skill.insertMany(SKILL_CATEGORIES);
      
      await Message.deleteMany({});
      await Message.insertMany(MOCK_MESSAGES);
    } else {
      const defaultData: LocalDBStructure = {
        profile: PERSONAL_INFO,
        projects: PROJECTS,
        experiences: EXPERIENCES,
        skills: SKILL_CATEGORIES,
        guestbook: MOCK_MESSAGES
      };
      saveLocalDBData(defaultData);
    }
    console.log('🔄 Đã reset dữ liệu về mặc định ban đầu.');
    return res.json({ message: 'Đã thiết lập lại dữ liệu mặc định thành công.' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi thiết lập lại dữ liệu.', error: (err as Error).message });
  }
});

// -------------------------------------------------------------
// SERVE STATIC FILES IN PRODUCTION
// -------------------------------------------------------------
const distPath = path.join(import.meta.dirname, '../dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  // If request is not for an API, serve index.html
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(distPath, 'index.html'));
  } else {
    res.status(404).json({ message: 'Không tìm thấy API endpoint này.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy trên cổng ${PORT}`);
});
