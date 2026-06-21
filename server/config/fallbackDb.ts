import fs from 'fs';
import path from 'path';
import { PERSONAL_INFO, PROJECTS, EXPERIENCES, SKILL_CATEGORIES, MOCK_MESSAGES } from '../../src/data';

const dbPath = path.join(import.meta.dirname, '../db.json');

// Interface representing the JSON structure
export interface LocalDBStructure {
  profile: typeof PERSONAL_INFO;
  projects: typeof PROJECTS;
  experiences: typeof EXPERIENCES;
  skills: typeof SKILL_CATEGORIES;
  guestbook: typeof MOCK_MESSAGES;
}

// Function to initialize default data
export const initFallbackDB = () => {
  if (!fs.existsSync(dbPath)) {
    const defaultData: LocalDBStructure = {
      profile: PERSONAL_INFO,
      projects: PROJECTS,
      experiences: EXPERIENCES,
      skills: SKILL_CATEGORIES,
      guestbook: MOCK_MESSAGES
    };
    fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2), 'utf-8');
    console.log('📁 Đã tạo CSDL JSON dự phòng db.json với dữ liệu mặc định thành công.');
  }
};

// Function to read all data
export const getLocalDBData = (): LocalDBStructure => {
  initFallbackDB();
  const fileContent = fs.readFileSync(dbPath, 'utf-8');
  try {
    return JSON.parse(fileContent);
  } catch (err) {
    console.error('Lỗi phân tích cú pháp db.json, khôi phục mặc định.', err);
    const defaultData: LocalDBStructure = {
      profile: PERSONAL_INFO,
      projects: PROJECTS,
      experiences: EXPERIENCES,
      skills: SKILL_CATEGORIES,
      guestbook: MOCK_MESSAGES
    };
    fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2), 'utf-8');
    return defaultData;
  }
};

// Function to save all data
export const saveLocalDBData = (data: LocalDBStructure) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
};
