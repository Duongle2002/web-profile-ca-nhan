/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import InteractiveBackground from './components/InteractiveBackground';
import HeroCard from './components/HeroCard';
import AboutCard from './components/AboutCard';
import ProjectsCard from './components/ProjectsCard';
import SkillsSandbox from './components/SkillsSandbox';
import ExperienceTimeline from './components/ExperienceTimeline';
import ContactGuestbook from './components/ContactGuestbook';
import EditorConsole from './components/EditorConsole';
import { Terminal, Shield, Star, Award, Layers, Sliders } from 'lucide-react';
import { PERSONAL_INFO, PROJECTS, EXPERIENCES, SKILL_CATEGORIES } from './data';

export default function App() {
  // Stateful client configurations
  const [personalInfo, setPersonalInfo] = useState(PERSONAL_INFO);
  const [projects, setProjects] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [skillCategories, setSkillCategories] = useState<any[]>([]);
  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem('duong_admin_password') || '';
  });

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  // Hidden trigger: Click HD logo 5 times within 2 seconds
  const handleLogoClick = () => {
    const now = Date.now();
    if (now - lastClickTime < 2000) {
      const clicks = logoClicks + 1;
      if (clicks >= 5) {
        setIsEditorOpen(true);
        setLogoClicks(0);
      } else {
        setLogoClicks(clicks);
      }
    } else {
      setLogoClicks(1);
    }
    setLastClickTime(now);
  };

  // Hidden trigger: Keyboard shortcut Ctrl + Shift + E
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setIsEditorOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fetchProfile = () => {
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => setPersonalInfo(data))
      .catch((err) => console.error('Lỗi lấy profile:', err));
  };

  const fetchProjects = () => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error('Lỗi lấy projects:', err));
  };

  const fetchExperiences = () => {
    fetch('/api/experiences')
      .then((res) => res.json())
      .then((data) => setExperiences(data))
      .catch((err) => console.error('Lỗi lấy experiences:', err));
  };

  const fetchSkills = () => {
    fetch('/api/skills')
      .then((res) => res.json())
      .then((data) => setSkillCategories(data))
      .catch((err) => console.error('Lỗi lấy skills:', err));
  };

  const fetchAllData = () => {
    fetchProfile();
    fetchProjects();
    fetchExperiences();
    fetchSkills();
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Sync state mutation handlers
  const handleSetPersonalInfo = async (info: any) => {
    setPersonalInfo(info);
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminPassword}`
        },
        body: JSON.stringify(info)
      });
      if (!res.ok) {
        const errData = await res.json();
        alert(`Lỗi lưu thông tin: ${errData.message}`);
        fetchProfile();
      }
    } catch (err) {
      console.error(err);
      alert('Không kết nối được server.');
      fetchProfile();
    }
  };

  const handleSetProjects = async (newProjects: any[]) => {
    setProjects(newProjects);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminPassword}`
        },
        body: JSON.stringify(newProjects)
      });
      if (!res.ok) {
        const errData = await res.json();
        alert(`Lỗi lưu dự án: ${errData.message}`);
        fetchProjects();
      }
    } catch (err) {
      console.error(err);
      alert('Không kết nối được server.');
      fetchProjects();
    }
  };

  const handleSetExperiences = async (newExp: any[]) => {
    setExperiences(newExp);
    try {
      const res = await fetch('/api/experiences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminPassword}`
        },
        body: JSON.stringify(newExp)
      });
      if (!res.ok) {
        const errData = await res.json();
        alert(`Lỗi lưu kinh nghiệm: ${errData.message}`);
        fetchExperiences();
      }
    } catch (err) {
      console.error(err);
      alert('Không kết nối được server.');
      fetchExperiences();
    }
  };

  const handleSetSkillCategories = async (newSkills: any[]) => {
    setSkillCategories(newSkills);
    try {
      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminPassword}`
        },
        body: JSON.stringify(newSkills)
      });
      if (!res.ok) {
        const errData = await res.json();
        alert(`Lỗi lưu kỹ năng: ${errData.message}`);
        fetchSkills();
      }
    } catch (err) {
      console.error(err);
      alert('Không kết nối được server.');
      fetchSkills();
    }
  };

  const handleResetToDefault = async () => {
    try {
      const res = await fetch('/api/reset', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminPassword}`
        }
      });
      if (res.ok) {
        alert('Đã khôi phục dữ liệu mặc định thành công.');
        fetchAllData();
      } else {
        const errData = await res.json();
        alert(`Lỗi reset: ${errData.message}`);
      }
    } catch (err) {
      console.error(err);
      alert('Không thể kết nối tới server để reset.');
    }
  };

  const scrollToId = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen text-black selection:bg-[#00D1FF]/40 selection:text-black noise-bg font-sans pb-16">
      {/* Immersive Click-Reactive Ripples & Glowing Background */}
      <InteractiveBackground />

      {/* Main Single-View Layout Container */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Subtle, Sophisticated Desktop Landing Header */}
        <header className="flex items-center justify-between py-4 border-b-4 border-black">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div 
              onClick={handleLogoClick}
              className="w-10 h-10 rounded-lg bg-[#FF3E00] border-2 border-black flex items-center justify-center font-mono font-black text-white text-sm shadow-[3px_3px_0px_0px_#000] cursor-pointer select-none"
            >
              HD
            </div>
            <div className="leading-none text-left">
              <span className="font-heading text-sm font-black tracking-wider text-black block">
                {personalInfo.fullName.toUpperCase()}
              </span>
              <span className="text-[10px] text-zinc-600 font-mono tracking-wider font-bold">
                {personalInfo.title.toUpperCase()}
              </span>
            </div>
          </motion.div>

          <div className="flex items-center gap-3">
            <motion.nav 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden md:flex items-center gap-1 bg-white border-2 border-black p-1 rounded-xl shadow-[4px_4px_0px_0px_#000]"
            >
              <button 
                onClick={() => scrollToId('intro')} 
                className="px-4 py-1.5 rounded-lg text-xs font-black text-black hover:bg-[#E0FF00] hover:translate-y-[-1px] transition-all cursor-pointer"
              >
                Tiểu sử
              </button>
              <button 
                onClick={() => scrollToId('projects')} 
                className="px-4 py-1.5 rounded-lg text-xs font-black text-black hover:bg-[#00D1FF] hover:translate-y-[-1px] transition-all cursor-pointer"
              >
                Dự án
              </button>
              <button 
                onClick={() => scrollToId('skills')} 
                className="px-4 py-1.5 rounded-lg text-xs font-black text-black hover:bg-[#FFD600] hover:translate-y-[-1px] transition-all cursor-pointer"
              >
                Kỹ năng
              </button>
              <button 
                onClick={() => scrollToId('guestbook')} 
                className="px-4 py-1.5 rounded-lg text-xs font-black text-black hover:bg-[#FF3E00] hover:text-white hover:translate-y-[-1px] transition-all cursor-pointer"
              >
                Lưu bút / Liên hệ
              </button>
            </motion.nav>
          </div>
        </header>

        {/* Bento Grid Structural Sheet */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT CHUNK: Profile & Bio (lg: col-span-5) — sticky khi scroll */}
          <section id="intro" className="lg:col-span-5 space-y-6 lg:sticky lg:top-8 lg:self-start">
            <HeroCard personalInfo={personalInfo} />
            <AboutCard personalInfo={personalInfo} />
          </section>

          {/* RIGHT CHUNK: Tech, Work, Guestbook & Projects (lg: col-span-7) */}
          <section className="lg:col-span-7 space-y-6 flex flex-col justify-start">
            {/* Active Projects Desk */}
            <div id="projects" className="scroll-mt-6">
              <ProjectsCard projects={projects} />
            </div>

            {/* Smart Technologies and Skills matching platform */}
            <div id="skills" className="scroll-mt-6">
              <SkillsSandbox skillCategories={skillCategories} />
            </div>

            {/* Experience timeline with foldable detail modules */}
            <div className="scroll-mt-6">
              <ExperienceTimeline experiences={experiences} />
            </div>

            {/* Living digital guestbook */}
            <div id="guestbook" className="scroll-mt-6">
              <ContactGuestbook personalInfo={personalInfo} />
            </div>
          </section>

        </main>

        {/* Footer block */}
        <footer className="pt-12 border-t-2 border-black text-center space-y-3">
          <p className="text-xs text-black font-mono tracking-widest font-black uppercase">
            © 2026 {personalInfo.fullName}. Tất cả bản quyền được bảo lưu.
          </p>
          <p className="text-[10px] text-zinc-700 font-bold max-w-sm mx-auto leading-relaxed">
            Được thiết kế theo định hướng Neo-brutalist Vibrant Palette. Mọi tương tác trực quan đều sống động qua chuyển động mượt mà.
          </p>
        </footer>

      </div>

      {/* Dynamic Drawer Component */}
      <EditorConsole
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        personalInfo={personalInfo}
        setPersonalInfo={handleSetPersonalInfo}
        projects={projects}
        setProjects={handleSetProjects}
        experiences={experiences}
        setExperiences={handleSetExperiences}
        skillCategories={skillCategories}
        setSkillCategories={handleSetSkillCategories}
        onResetToDefault={handleResetToDefault}
        adminPassword={adminPassword}
        setAdminPassword={setAdminPassword}
      />
    </div>
  );
}
