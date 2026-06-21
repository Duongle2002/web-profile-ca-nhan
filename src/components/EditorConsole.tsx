import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Save, RotateCcw, User, Zap, Briefcase, Layers, 
  Plus, Trash2, Edit3, ArrowRight, Eye, Check, Key
} from 'lucide-react';
import { Project, Experience, SkillCategory } from '../types';

interface EditorConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  personalInfo: any;
  setPersonalInfo: (info: any) => void;
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  experiences: Experience[];
  setExperiences: (experiences: Experience[]) => void;
  skillCategories: SkillCategory[];
  setSkillCategories: (skills: SkillCategory[]) => void;
  onResetToDefault: () => void;
  adminPassword: string;
  setAdminPassword: (pw: string) => void;
}

type EditorTab = 'general' | 'skills' | 'timeline' | 'projects';

export default function EditorConsole({
  isOpen,
  onClose,
  personalInfo,
  setPersonalInfo,
  projects,
  setProjects,
  experiences,
  setExperiences,
  skillCategories,
  setSkillCategories,
  onResetToDefault,
  adminPassword,
  setAdminPassword
}: EditorConsoleProps) {
  const [activeTab, setActiveTab] = useState<EditorTab>('general');
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  // General tab states matching personalInfo
  const [fullName, setFullName] = useState(personalInfo.fullName);
  const [title, setTitle] = useState(personalInfo.title);
  const [tagline, setTagline] = useState(personalInfo.tagline);
  const [aboutLong, setAboutLong] = useState(personalInfo.aboutLong);
  const [location, setLocation] = useState(personalInfo.location);
  const [email, setEmail] = useState(personalInfo.email);
  const [github, setGithub] = useState(personalInfo.github || '');
  const [linkedin, setLinkedin] = useState(personalInfo.linkedin || '');
  const [facebook, setFacebook] = useState(personalInfo.facebook || '');
  const [zalo, setZalo] = useState(personalInfo.zalo || '');
  const [tiktok, setTiktok] = useState(personalInfo.tiktok || '');
  const [youtube, setYoutube] = useState(personalInfo.youtube || '');

  const [showGithub, setShowGithub] = useState(personalInfo.showGithub !== false);
  const [showLinkedin, setShowLinkedin] = useState(personalInfo.showLinkedin !== false);
  const [showFacebook, setShowFacebook] = useState(!!personalInfo.showFacebook);
  const [showZalo, setShowZalo] = useState(!!personalInfo.showZalo);
  const [showTiktok, setShowTiktok] = useState(!!personalInfo.showTiktok);
  const [showYoutube, setShowYoutube] = useState(!!personalInfo.showYoutube);

  const [statusText, setStatusText] = useState(personalInfo.status?.text || '');
  const [localSkills, setLocalSkills] = useState<SkillCategory[]>([]);

  // Sync props to local state when drawer is opened or updated
  useEffect(() => {
    if (isOpen) {
      setFullName(personalInfo.fullName || '');
      setTitle(personalInfo.title || '');
      setTagline(personalInfo.tagline || '');
      setAboutLong(personalInfo.aboutLong || '');
      setLocation(personalInfo.location || '');
      setEmail(personalInfo.email || '');
      setGithub(personalInfo.github || '');
      setLinkedin(personalInfo.linkedin || '');
      setFacebook(personalInfo.facebook || '');
      setZalo(personalInfo.zalo || '');
      setTiktok(personalInfo.tiktok || '');
      setYoutube(personalInfo.youtube || '');

      setShowGithub(personalInfo.showGithub !== false);
      setShowLinkedin(personalInfo.showLinkedin !== false);
      setShowFacebook(!!personalInfo.showFacebook);
      setShowZalo(!!personalInfo.showZalo);
      setShowTiktok(!!personalInfo.showTiktok);
      setShowYoutube(!!personalInfo.showYoutube);

      setStatusText(personalInfo.status?.text || '');
      setLocalSkills(JSON.parse(JSON.stringify(skillCategories || [])));
    }
  }, [isOpen, personalInfo, skillCategories]);

  // Local helper for saving General info
  const handleSaveGeneral = () => {
    setPersonalInfo({
      ...personalInfo,
      fullName,
      title,
      tagline,
      aboutLong,
      location,
      email,
      github,
      linkedin,
      facebook,
      zalo,
      tiktok,
      youtube,
      showGithub,
      showLinkedin,
      showFacebook,
      showZalo,
      showTiktok,
      showYoutube,
      status: {
        ...personalInfo.status,
        text: statusText
      }
    });
    triggerSavedFeedback();
  };

  const triggerSavedFeedback = () => {
    setShowSavedFeedback(true);
    setTimeout(() => setShowSavedFeedback(false), 2000);
  };

  // State elements for active editing targets
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [newProject, setNewProject] = useState<Partial<Project>>({});
  
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);
  const [newExperience, setNewExperience] = useState<Partial<Experience>>({});
  // Raw text state for skills input to avoid split/join on every keystroke
  const [expSkillsText, setExpSkillsText] = useState('');

  // Sync expSkillsText when opening an experience for editing
  useEffect(() => {
    if (editingExperienceId !== null) {
      setExpSkillsText((newExperience.skills || []).join(', '));
    }
  }, [editingExperienceId]);

  // Reset helper
  const handleReset = () => {
    if (window.confirm("Bạn có chắc chắn muốn đặt lại tất cả dữ liệu về mặc định ban đầu? Các thay đổi của bạn sẽ bị xóa.")) {
      onResetToDefault();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark Overlay with subtle noise */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />

          {/* Neo-brutalist Console Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white border-l-4 border-black z-50 flex flex-col justify-between text-black shadow-[-8px_0px_0px_0px_#000]"
          >
            {/* Header section (Neo-brutalist bold headers) */}
            <div className="p-5 border-b-4 border-black bg-[#E0FF00] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1 px-2.5 bg-black text-white font-mono font-black rounded border-2 border-black text-xs uppercase shadow-[2px_2px_0px_0px_#FFF]">
                  EDIT
                </div>
                <h2 className="text-xl font-black font-heading tracking-tight italic uppercase text-black">
                  Bảng Điều Khiển Soạn Thảo
                </h2>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="p-2 rounded-lg bg-white border-2 border-black hover:bg-red-100 text-black transition-all cursor-pointer shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px]"
                  title="Đặt lại mặc định"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg bg-[#FF3E00] border-2 border-black text-white hover:bg-[#FF3E00]/90 transition-all cursor-pointer shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Console Sub-Navigation (Tabs) */}
            <div className="flex border-b-2 border-black bg-[#FFF5E1] p-1 overflow-x-auto gap-1">
              {[
                { id: 'general', label: 'Cơ bản', icon: User, color: '#FF3E00' },
                { id: 'skills', label: 'Năng lực', icon: Zap, color: '#FFD600' },
                { id: 'timeline', label: 'Hành trình', icon: Briefcase, color: '#E0FF00' },
                { id: 'projects', label: 'Dự án', icon: Layers, color: '#00D1FF' }
              ].map((tab) => {
                const TabIcon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as EditorTab);
                      setEditingProjectId(null);
                      setEditingExperienceId(null);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-black uppercase tracking-wide border-2 transition-all cursor-pointer outline-none ${
                      isSelected 
                        ? 'border-black text-black shadow-[2px_2px_0px_0px_#000]' 
                        : 'border-transparent text-zinc-700 hover:text-black hover:border-zinc-300'
                    }`}
                    style={{ backgroundColor: isSelected ? tab.color : 'transparent' }}
                  >
                    <TabIcon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Scrolling Edit Form Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-50">
              
              {/* SAVED FLOATING FEEDBACK BAR */}
              <AnimatePresence>
                {showSavedFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-3 bg-emerald-500 border-2 border-black text-white font-black text-sm uppercase rounded-lg shadow-[3px_3px_0px_0px_#000] text-center flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    <span>Đã lưu thành công và cập nhật ngay lập tức! ✨</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* NO PASSWORD WARNING BANNER */}
              {!adminPassword.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-amber-100 border-2 border-amber-400 text-amber-900 font-black text-xs uppercase rounded-lg flex items-center gap-2"
                >
                  <Key className="w-4 h-4 flex-shrink-0" />
                  <span>Nhập mật khẩu Admin bên dưới để kích hoạt chức năng lưu ✦</span>
                </motion.div>
              )}

              {/* 1. GENERAL TAB */}
              {activeTab === 'general' && (
                <div className="space-y-4">
                  <div className="p-4 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000]">
                    <h3 className="text-sm font-black font-heading uppercase text-black italic mb-3 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-[#FF3E00]" />
                      Thông tin cá nhân chính
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1 text-left">
                        <label className="text-[11px] font-black text-zinc-700 uppercase">Họ và tên</label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-white border-2 border-black focus:bg-amber-50/20 text-xs font-bold text-black outline-none"
                        />
                      </div>
                      
                      <div className="space-y-1 text-left">
                        <label className="text-[11px] font-black text-zinc-700 uppercase">Chức danh / Định vị</label>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-white border-2 border-black focus:bg-amber-50/20 text-xs font-bold text-black outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 text-left mt-3">
                      <label className="text-[11px] font-black text-zinc-700 uppercase">Tagline truyền cảm hứng</label>
                      <input
                        type="text"
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white border-2 border-black focus:bg-amber-50/20 text-xs font-bold text-black outline-none"
                      />
                    </div>

                    <div className="space-y-1 text-left mt-3">
                      <label className="text-[11px] font-black text-zinc-700 uppercase">Địa điểm hoạt động</label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white border-2 border-black focus:bg-amber-50/20 text-xs font-bold text-black outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000]">
                    <h3 className="text-sm font-black font-heading uppercase text-black italic mb-3 flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-[#00D1FF]" />
                      Trạng thái hoạt động & Liên kết
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1 text-left">
                        <label className="text-[11px] font-black text-zinc-700 uppercase">Email cá nhân</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-white border-2 border-black focus:bg-amber-50/20 text-xs font-bold text-black outline-none"
                        />
                      </div>

                      <div className="space-y-1 text-left">
                        <label className="text-[11px] font-black text-zinc-700 uppercase">Trạng thái công việc</label>
                        <input
                          type="text"
                          value={statusText}
                          onChange={(e) => setStatusText(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-white border-2 border-black focus:bg-amber-50/20 text-xs font-bold text-black outline-none"
                        />
                      </div>
                    </div>

                    {/* Social Links and Toggles */}
                    <div className="space-y-3 mt-4 pt-3 border-t-2 border-dashed border-zinc-200">
                      <h4 className="text-xs font-black uppercase text-zinc-650 text-left">Liên kết Mạng xã hội & Hiển thị</h4>
                      
                      {/* GitHub */}
                      <div className="flex items-center gap-3 bg-zinc-50 p-2 rounded-lg border border-zinc-200">
                        <div className="flex-1 space-y-1 text-left">
                          <label className="text-[10px] font-black text-zinc-700 uppercase">Link GitHub</label>
                          <input
                            type="text"
                            value={github}
                            onChange={(e) => setGithub(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded bg-white border-2 border-black text-xs font-bold text-black outline-none"
                          />
                        </div>
                        <label className="flex items-center gap-1.5 cursor-pointer select-none text-xs font-black mt-4">
                          <input
                            type="checkbox"
                            checked={showGithub}
                            onChange={(e) => setShowGithub(e.target.checked)}
                            className="w-4 h-4 accent-[#FF3E00] cursor-pointer"
                          />
                          <span>Hiện</span>
                        </label>
                      </div>

                      {/* LinkedIn */}
                      <div className="flex items-center gap-3 bg-zinc-50 p-2 rounded-lg border border-zinc-200">
                        <div className="flex-1 space-y-1 text-left">
                          <label className="text-[10px] font-black text-zinc-700 uppercase">Link LinkedIn</label>
                          <input
                            type="text"
                            value={linkedin}
                            onChange={(e) => setLinkedin(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded bg-white border-2 border-black text-xs font-bold text-black outline-none"
                          />
                        </div>
                        <label className="flex items-center gap-1.5 cursor-pointer select-none text-xs font-black mt-4">
                          <input
                            type="checkbox"
                            checked={showLinkedin}
                            onChange={(e) => setShowLinkedin(e.target.checked)}
                            className="w-4 h-4 accent-[#FF3E00] cursor-pointer"
                          />
                          <span>Hiện</span>
                        </label>
                      </div>

                      {/* Facebook */}
                      <div className="flex items-center gap-3 bg-zinc-50 p-2 rounded-lg border border-zinc-200">
                        <div className="flex-1 space-y-1 text-left">
                          <label className="text-[10px] font-black text-zinc-700 uppercase">Link Facebook</label>
                          <input
                            type="text"
                            value={facebook}
                            onChange={(e) => setFacebook(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded bg-white border-2 border-black text-xs font-bold text-black outline-none"
                          />
                        </div>
                        <label className="flex items-center gap-1.5 cursor-pointer select-none text-xs font-black mt-4">
                          <input
                            type="checkbox"
                            checked={showFacebook}
                            onChange={(e) => setShowFacebook(e.target.checked)}
                            className="w-4 h-4 accent-[#FF3E00] cursor-pointer"
                          />
                          <span>Hiện</span>
                        </label>
                      </div>

                      {/* Zalo */}
                      <div className="flex items-center gap-3 bg-zinc-50 p-2 rounded-lg border border-zinc-200">
                        <div className="flex-1 space-y-1 text-left">
                          <label className="text-[10px] font-black text-zinc-700 uppercase">Link Zalo / SĐT</label>
                          <input
                            type="text"
                            value={zalo}
                            onChange={(e) => setZalo(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded bg-white border-2 border-black text-xs font-bold text-black outline-none"
                          />
                        </div>
                        <label className="flex items-center gap-1.5 cursor-pointer select-none text-xs font-black mt-4">
                          <input
                            type="checkbox"
                            checked={showZalo}
                            onChange={(e) => setShowZalo(e.target.checked)}
                            className="w-4 h-4 accent-[#FF3E00] cursor-pointer"
                          />
                          <span>Hiện</span>
                        </label>
                      </div>

                      {/* TikTok */}
                      <div className="flex items-center gap-3 bg-zinc-50 p-2 rounded-lg border border-zinc-200">
                        <div className="flex-1 space-y-1 text-left">
                          <label className="text-[10px] font-black text-zinc-700 uppercase">Link TikTok</label>
                          <input
                            type="text"
                            value={tiktok}
                            onChange={(e) => setTiktok(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded bg-white border-2 border-black text-xs font-bold text-black outline-none"
                          />
                        </div>
                        <label className="flex items-center gap-1.5 cursor-pointer select-none text-xs font-black mt-4">
                          <input
                            type="checkbox"
                            checked={showTiktok}
                            onChange={(e) => setShowTiktok(e.target.checked)}
                            className="w-4 h-4 accent-[#FF3E00] cursor-pointer"
                          />
                          <span>Hiện</span>
                        </label>
                      </div>

                      {/* YouTube */}
                      <div className="flex items-center gap-3 bg-zinc-50 p-2 rounded-lg border border-zinc-200">
                        <div className="flex-1 space-y-1 text-left">
                          <label className="text-[10px] font-black text-zinc-700 uppercase">Link YouTube</label>
                          <input
                            type="text"
                            value={youtube}
                            onChange={(e) => setYoutube(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded bg-white border-2 border-black text-xs font-bold text-black outline-none"
                          />
                        </div>
                        <label className="flex items-center gap-1.5 cursor-pointer select-none text-xs font-black mt-4">
                          <input
                            type="checkbox"
                            checked={showYoutube}
                            onChange={(e) => setShowYoutube(e.target.checked)}
                            className="w-4 h-4 accent-[#FF3E00] cursor-pointer"
                          />
                          <span>Hiện</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000]">
                    <h3 className="text-sm font-black font-heading uppercase text-black italic mb-2">
                      Tiểu sử chi tiết (About Me tabs)
                    </h3>
                    <div className="space-y-1 text-left">
                      <textarea
                        value={aboutLong}
                        onChange={(e) => setAboutLong(e.target.value)}
                        rows={5}
                        className="w-full px-3 py-2 rounded-lg bg-white border-2 border-black focus:bg-amber-50/20 text-xs font-bold text-black outline-none resize-none"
                      />
                    </div>
                  </div>

                  {adminPassword.trim() ? (
                    <button
                      onClick={handleSaveGeneral}
                      className="w-full py-3 bg-[#FF3E00] hover:bg-[#FF3E00]/95 text-white border-4 border-black font-black uppercase text-sm tracking-widest hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[1px] active:translate-y-[1px] shadow-[4px_4px_0px_0px_#000] cursor-pointer transition-all flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Lưu thông tin cơ bản</span>
                    </button>
                  ) : (
                    <div className="w-full py-3 bg-zinc-100 border-4 border-dashed border-zinc-300 text-zinc-400 font-black uppercase text-sm tracking-widest flex items-center justify-center gap-2 rounded select-none">
                      <Key className="w-4 h-4" />
                      <span>Cần mật khẩu để lưu</span>
                    </div>
                  )}
                </div>
              )}

              {/* 2. SKILLS TAB */}
              {activeTab === 'skills' && (
                <div className="space-y-6">
                  {localSkills.map((category, catIdx) => (
                    <div key={category.id} className="p-4 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] space-y-4">
                      <div className="flex items-center justify-between border-b-2 border-black pb-2 bg-[#FFF5E1] p-1.5 rounded">
                        <input
                          type="text"
                          value={category.name}
                          onChange={(e) => {
                            const updated = [...localSkills];
                            updated[catIdx].name = e.target.value;
                            setLocalSkills(updated);
                          }}
                          className="font-black text-sm bg-transparent outline-none border-b border-dashed border-black focus:border-[#FF3E00]"
                        />
                        <span className="text-[10px] bg-black text-white px-1.5 py-0.5 font-bold uppercase rounded">
                          NHÓM {catIdx + 1}
                        </span>
                      </div>

                      {/* List of Skills inside category */}
                      <div className="space-y-3.5">
                        {category.skills.map((skill, skillIdx) => (
                          <div key={skillIdx} className="space-y-1 bg-zinc-50 p-2.5 rounded-lg border border-zinc-200">
                            <div className="flex items-center justify-between gap-3 text-xs">
                              <input
                                type="text"
                                value={skill.name}
                                onChange={(e) => {
                                  const updated = [...localSkills];
                                  updated[catIdx].skills[skillIdx].name = e.target.value;
                                  setLocalSkills(updated);
                                }}
                                className="font-bold text-black bg-transparent outline-none border-b border-transparent focus:border-zinc-400 w-2/3"
                              />
                              
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[11px] font-black">{skill.level}%</span>
                                <button
                                  onClick={() => {
                                    const updated = [...localSkills];
                                    updated[catIdx].skills.splice(skillIdx, 1);
                                    setLocalSkills(updated);
                                  }}
                                  className="text-red-500 hover:text-red-700 p-1 rounded"
                                  title="Xóa kỹ năng"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            
                            {/* Sliders for Level */}
                            <div className="flex items-center gap-3">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={skill.level}
                                onChange={(e) => {
                                  const updated = [...localSkills];
                                  updated[catIdx].skills[skillIdx].level = parseInt(e.target.value);
                                  setLocalSkills(updated);
                                }}
                                className="w-full accent-[#FF3E00] cursor-pointer"
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add New Skill to Category */}
                      <button
                        onClick={() => {
                          const updated = [...localSkills];
                          updated[catIdx].skills.push({
                            name: "Công nghệ mới",
                            level: 80,
                            iconName: "Zap"
                          });
                          setLocalSkills(updated);
                        }}
                        className="w-full py-1.5 bg-[#E0FF00] hover:bg-[#E0FF00]/85 text-black border-2 border-black rounded-lg font-black text-xs uppercase flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Thêm kỹ năng vào {category.name.split(' ')[0]}</span>
                      </button>
                    </div>
                  ))}
                  
                  {adminPassword.trim() ? (
                    <button
                      onClick={() => {
                        setSkillCategories(localSkills);
                        localStorage.setItem('duong_portfolio_skills', JSON.stringify(localSkills));
                        triggerSavedFeedback();
                      }}
                      className="w-full py-3 bg-[#FF3E00] hover:bg-[#FF3E00]/95 text-white border-4 border-black font-black uppercase text-sm tracking-widest hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[1px] active:translate-y-[1px] shadow-[4px_4px_0px_0px_#000] cursor-pointer transition-all flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Lưu danh sách kỹ năng</span>
                    </button>
                  ) : (
                    <div className="w-full py-3 bg-zinc-100 border-4 border-dashed border-zinc-300 text-zinc-400 font-black uppercase text-sm tracking-widest flex items-center justify-center gap-2 rounded select-none">
                      <Key className="w-4 h-4" />
                      <span>Cần mật khẩu để lưu</span>
                    </div>
                  )}

                  <div className="p-4 bg-[#00D1FF]/10 border-2 border-black rounded-xl text-center">
                    <p className="text-xs font-bold text-black italic">
                      💡 Mẹo: Nhấn nút "Lưu danh sách kỹ năng" để áp dụng và đồng bộ hóa năng lực của bạn lên cơ sở dữ liệu.
                    </p>
                  </div>
                </div>
              )}

              {/* 3. EXPERIENCE TIMELINE TAB */}
              {activeTab === 'timeline' && (
                <div className="space-y-4">
                  {editingExperienceId === null ? (
                    <>
                      {/* List View with Add Button */}
                      <div className="space-y-3">
                        {experiences.map((exp) => (
                          <div 
                            key={exp.id} 
                            className="p-4 bg-white border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000] flex items-center justify-between gap-3 text-left"
                          >
                            <div>
                              <p className="text-xs font-black text-[#FF3E00] uppercase font-mono">{exp.company}</p>
                              <h4 className="font-black text-sm text-black italic mt-0.5">{exp.role}</h4>
                              <p className="text-[10px] text-zinc-500 font-bold font-mono mt-0.5">{exp.duration}</p>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  setEditingExperienceId(exp.id);
                                  setNewExperience({ ...exp });
                                  setExpSkillsText((exp.skills || []).join(', '));
                                }}
                                className="p-1 px-2.5 bg-[#00D1FF] border-2 border-black rounded-lg text-xs font-black uppercase flex items-center gap-1 shadow-[2px_2px_0px_0px_#000] cursor-pointer"
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>Sửa</span>
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Xóa lịch sử hành trình: ${exp.role}?`)) {
                                    const updated = experiences.filter(e => e.id !== exp.id);
                                    setExperiences(updated);
                                    localStorage.setItem('duong_portfolio_experiences', JSON.stringify(updated));
                                    triggerSavedFeedback();
                                  }
                                }}
                                className="p-1 px-2 bg-red-500 border-2 border-black rounded-lg text-white font-black shadow-[2px_2px_0px_0px_#000] cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add Button */}
                      <button
                        onClick={() => {
                          const tempId = `exp-temp-${Date.now()}`;
                          setEditingExperienceId(tempId);
                          setNewExperience({
                            id: tempId,
                            company: "Tên Công ty / Trường học mới",
                            role: "Vị trí ứng tuyển / Ngành học",
                            duration: "2025 - 2026",
                            description: "Mô tả ngắn gọn về vai trò và nhiệm vụ cốt lõi.",
                            skills: ["Kỹ năng 1", "Kỹ năng 2"],
                            type: "work",
                            details: ["Thành tựu xuất sắc số 1", "Thành tựu xuất sắc số 2"]
                          });
                          setExpSkillsText("Kỹ năng 1, Kỹ năng 2");
                        }}
                        className="w-full py-3 bg-[#E0FF00] hover:bg-[#E0FF00]/95 text-black border-4 border-black font-black uppercase text-sm tracking-widest hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[1px] active:translate-y-[1px] shadow-[4px_4px_0px_0px_#000] cursor-pointer transition-all flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Thêm kinh nghiệm / Học vấn mới</span>
                      </button>
                    </>
                  ) : (
                    /* Edit Form View for Experience */
                    <div className="p-4 bg-white border-2 border-black rounded-xl space-y-4">
                      <div className="flex items-center justify-between border-b-2 border-black pb-2 bg-[#FFF5E1] p-2 rounded">
                        <span className="font-black text-xs uppercase text-black">
                          {newExperience.id?.startsWith('exp-temp-') ? 'Thêm hành trình mới' : 'Cập nhật hành trình'}
                        </span>
                        <button
                          onClick={() => setEditingExperienceId(null)}
                          className="font-black text-xs text-red-500 hover:underline cursor-pointer"
                        >
                          Hủy bỏ
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-zinc-650">Đơn vị / Cơ sở</label>
                          <input
                            type="text"
                            value={newExperience.company || ''}
                            onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                            className="w-full px-2 py-1.5 border-2 border-black text-xs font-bold rounded-md bg-white text-black"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-zinc-650">Vai trò / Chức danh</label>
                          <input
                            type="text"
                            value={newExperience.role || ''}
                            onChange={(e) => setNewExperience({ ...newExperience, role: e.target.value })}
                            className="w-full px-2 py-1.5 border-2 border-black text-xs font-bold rounded-md bg-white text-black"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-zinc-650">Khoảng thời gian</label>
                          <input
                            type="text"
                            value={newExperience.duration || ''}
                            onChange={(e) => setNewExperience({ ...newExperience, duration: e.target.value })}
                            className="w-full px-2 py-1.5 border-2 border-black text-xs font-bold rounded-md bg-white text-black"
                            placeholder="Ví dụ: 2024 - 2025"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-zinc-650">Phân loại</label>
                          <select
                            value={newExperience.type || 'work'}
                            onChange={(e) => setNewExperience({ ...newExperience, type: e.target.value as any })}
                            className="w-full px-2 py-1.5 border-2 border-black text-xs font-bold rounded-md bg-white text-black"
                          >
                            <option value="work">Làm việc (Work)</option>
                            <option value="education">Học vấn (Education)</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1 text-left">
                        <label className="text-[10px] font-black uppercase text-zinc-650">Tóm tắt ngắn</label>
                        <input
                          type="text"
                          value={newExperience.description || ''}
                          onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                          className="w-full px-2 py-1.5 border-2 border-black text-xs font-bold rounded-md bg-white text-black"
                        />
                      </div>

                      <div className="space-y-1 text-left">
                        <label className="text-[10px] font-black uppercase text-zinc-650">Thành quả chính (Mỗi dòng 1 gạch đầu dòng)</label>
                        <textarea
                          rows={4}
                          value={(newExperience.details || []).join('\n')}
                          onChange={(e) => {
                            const detailsArr = e.target.value.split('\n');
                            setNewExperience({ ...newExperience, details: detailsArr });
                          }}
                          className="w-full px-3 py-2 border-2 border-black text-xs font-semibold rounded-md bg-white text-black resize-none"
                          placeholder="Mục đạt được 1&#10;Mục đạt được 2"
                        />
                      </div>

                      <div className="space-y-1 text-left">
                        <label className="text-[10px] font-black uppercase text-zinc-650">Công cụ / Kỹ năng sử dụng (Phân cách bằng dấu phẩy)</label>
                        <input
                          type="text"
                          value={expSkillsText}
                          onChange={(e) => {
                            // Chỉ lưu string thô, không parse ngay để tránh mất cursor khi gõ dấu phẩy/khoảng trắng
                            setExpSkillsText(e.target.value);
                          }}
                          onBlur={() => {
                            // Parse khi mất focus: tách theo phẩy, trim, lọc rỗng
                            const skillsArr = expSkillsText.split(',').map(s => s.trim()).filter(Boolean);
                            setNewExperience({ ...newExperience, skills: skillsArr });
                          }}
                          className="w-full px-2 py-1.5 border-2 border-black text-xs font-bold rounded-md bg-white text-black"
                          placeholder="React, Node.js, Docker, ..."
                        />
                        <p className="text-[10px] text-zinc-500 font-medium">Nhập xong nhấn Tab hoặc click ra ngoài để xác nhận · Phân cách bằng dấu phẩy</p>
                      </div>

                      <button
                        onClick={() => {
                          const existingIdx = experiences.findIndex(e => e.id === newExperience.id);
                          let updated: Experience[] = [];
                          if (existingIdx !== -1) {
                            updated = [...experiences];
                            updated[existingIdx] = newExperience as Experience;
                          } else {
                            updated = [...experiences, newExperience as Experience];
                          }
                          setExperiences(updated);
                          localStorage.setItem('duong_portfolio_experiences', JSON.stringify(updated));
                          setEditingExperienceId(null);
                          triggerSavedFeedback();
                        }}
                        className="w-full py-2 bg-[#FF3E00] hover:bg-[#FF3E00]/95 text-white border-2 border-black font-black text-xs uppercase rounded shadow-[2px_2px_0px_0px_#000] cursor-pointer"
                        disabled={!adminPassword.trim()}
                        style={{ opacity: adminPassword.trim() ? 1 : 0.35, cursor: adminPassword.trim() ? 'pointer' : 'not-allowed' }}
                      >
                        {adminPassword.trim() ? 'Lưu chi tiết hành trình này' : '🔐 Cần mật khẩu để lưu'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* 4. PROJECTS TAB */}
              {activeTab === 'projects' && (
                <div className="space-y-4">
                  {editingProjectId === null ? (
                    <>
                      {/* List View with Add Button */}
                      <div className="space-y-3">
                        {projects.map((proj) => (
                          <div 
                            key={proj.id} 
                            className="p-4 bg-white border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000] flex items-center justify-between gap-3 text-left"
                          >
                            <div className="flex items-center gap-2.5 overflow-hidden">
                              <img 
                                src={proj.image} 
                                alt={proj.title} 
                                className="w-10 h-10 object-cover rounded border border-black flex-shrink-0"
                                referrerPolicy="no-referrer"
                              />
                              <div className="overflow-hidden">
                                <h4 className="font-black text-sm text-black truncate">{proj.title}</h4>
                                <p className="text-[10px] text-zinc-550 font-bold truncate">{proj.subtitle}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  setEditingProjectId(proj.id);
                                  setNewProject({ ...proj });
                                }}
                                className="p-1 px-2.5 bg-[#00D1FF] border-2 border-black rounded-lg text-xs font-black uppercase flex items-center gap-1 shadow-[2px_2px_0px_0px_#000] cursor-pointer"
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>Sửa</span>
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Xóa dự án: ${proj.title}?`)) {
                                    const updated = projects.filter(p => p.id !== proj.id);
                                    setProjects(updated);
                                    localStorage.setItem('duong_portfolio_projects', JSON.stringify(updated));
                                    triggerSavedFeedback();
                                  }
                                }}
                                className="p-1 px-2 bg-red-500 border-2 border-black rounded-lg text-white font-black shadow-[2px_2px_0px_0px_#000] cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add Button */}
                      <button
                        onClick={() => {
                          const tempId = `proj-temp-${Date.now()}`;
                          setEditingProjectId(tempId);
                          setNewProject({
                            id: tempId,
                            title: "Dự án Công nghệ Mới",
                            subtitle: "Sản phẩm cách mạng sáng tạo",
                            description: "Phát biểu ngắn giới thiệu về sản phẩm độc quyền.",
                            longDescription: "Bản báo cáo kỹ thuật chi tiết chỉ ra công năng chuyên biệt vượt bậc.",
                            tags: ["React", "AI", "Tailwind"],
                            category: "web",
                            stats: [
                              { label: "Performance Boost", value: "+45%" },
                              { label: "Active Users", value: "850+" }
                            ],
                            image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
                            demoUrl: "#",
                            githubUrl: "#",
                            featured: false
                          });
                        }}
                        className="w-full py-3 bg-[#00D1FF] hover:bg-[#00D1FF]/95 text-black border-4 border-black font-black uppercase text-sm tracking-widest hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[1px] active:translate-y-[1px] shadow-[4px_4px_0px_0px_#000] cursor-pointer transition-all flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Chế tạo một dự án mới</span>
                      </button>
                    </>
                  ) : (
                    /* Edit Form View for Project */
                    <div className="p-4 bg-white border-2 border-black rounded-xl space-y-4">
                      <div className="flex items-center justify-between border-b-2 border-black pb-2 bg-[#FFF5E1] p-2 rounded">
                        <span className="font-black text-xs uppercase text-black">
                          {newProject.id?.startsWith('proj-temp-') ? 'Tạo dự án mới' : 'Cập nhật dự án'}
                        </span>
                        <button
                          onClick={() => setEditingProjectId(null)}
                          className="font-black text-xs text-red-500 hover:underline cursor-pointer"
                        >
                          Hủy bỏ
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-zinc-650">Tên dự án</label>
                          <input
                            type="text"
                            value={newProject.title || ''}
                            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                            className="w-full px-2 py-1.5 border-2 border-black text-xs font-bold rounded-md bg-white text-black"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-zinc-650">Dòng giới thiệu</label>
                          <input
                            type="text"
                            value={newProject.subtitle || ''}
                            onChange={(e) => setNewProject({ ...newProject, subtitle: e.target.value })}
                            className="w-full px-2 py-1.5 border-2 border-black text-xs font-bold rounded-md bg-white text-black"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-zinc-650">Lĩnh vực phân loại</label>
                          <select
                            value={newProject.category || 'web'}
                            onChange={(e) => setNewProject({ ...newProject, category: e.target.value as any })}
                            className="w-full px-2 py-1.5 border-2 border-black text-xs font-bold rounded-md bg-white text-black"
                          >
                            <option value="web">Công nghệ Web (Web)</option>
                            <option value="mobile">Di Động (Mobile)</option>
                            <option value="ai">Trí tuệ nhân đạo (AI)</option>
                            <option value="design">Thiết kế sáng tạo</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-zinc-650">Tính năng nổi bật</label>
                          <select
                            value={newProject.featured ? 'true' : 'false'}
                            onChange={(e) => setNewProject({ ...newProject, featured: e.target.value === 'true' })}
                            className="w-full px-2 py-1.5 border-2 border-black text-xs font-bold rounded-md bg-white text-black"
                          >
                            <option value="false">Bình thường</option>
                            <option value="true">Ghim ưu tiên (⭐)</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1 text-left">
                        <label className="text-[10px] font-black uppercase text-zinc-650">Mô tả tóm tắt ngắn</label>
                        <input
                          type="text"
                          value={newProject.description || ''}
                          onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                          className="w-full px-2 py-1.5 border-2 border-black text-xs font-bold rounded-md bg-white text-black"
                        />
                      </div>

                      <div className="space-y-1 text-left">
                        <label className="text-[10px] font-black uppercase text-zinc-650">Bài viết phân tích đầy đủ</label>
                        <textarea
                          rows={4}
                          value={newProject.longDescription || ''}
                          onChange={(e) => setNewProject({ ...newProject, longDescription: e.target.value })}
                          className="w-full px-3 py-2 border-2 border-black text-xs font-semibold rounded-md bg-white text-black resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-zinc-650">Đường dẫn ảnh nền</label>
                          <input
                            type="text"
                            value={newProject.image || ''}
                            onChange={(e) => setNewProject({ ...newProject, image: e.target.value })}
                            className="w-full px-2 py-1.5 border-2 border-black text-xs font-bold rounded-md bg-white text-black"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-zinc-650">Trải nghiệm Demo</label>
                          <input
                            type="text"
                            value={newProject.demoUrl || ''}
                            onChange={(e) => setNewProject({ ...newProject, demoUrl: e.target.value })}
                            className="w-full px-2 py-1.5 border-2 border-black text-xs font-bold rounded-md bg-white text-black"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-zinc-650">Source Mã Code (GitHub)</label>
                          <input
                            type="text"
                            value={newProject.githubUrl || ''}
                            onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                            className="w-full px-2 py-1.5 border-2 border-black text-xs font-bold rounded-md bg-white text-black"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-zinc-650">Công nghệ (cách nhau bằng dấu phẩy)</label>
                          <input
                            type="text"
                            value={(newProject.tags || []).join(', ')}
                            onChange={(e) => {
                              const tagsArr = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                              setNewProject({ ...newProject, tags: tagsArr });
                            }}
                            className="w-full px-2 py-1.5 border-2 border-black text-xs font-bold rounded-md bg-white text-black"
                            placeholder="Vite, Express, AI"
                          />
                        </div>
                      </div>

                      {/* Editing Stat Metrics */}
                      <div className="space-y-2 text-left bg-zinc-50 p-3 rounded-lg border">
                        <label className="text-[10px] font-black uppercase text-zinc-650 block">Các thông số thành tích (Ví dụ: Loading Speed - 0.8s)</label>
                        {[0, 1].map((idx) => {
                          const stat = (newProject.stats || [])[idx] || { label: '', value: '' };
                          return (
                            <div key={idx} className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                placeholder={`Tên chỉ số ${idx + 1}`}
                                value={stat.label}
                                onChange={(e) => {
                                  const statsArr = [...(newProject.stats || [])];
                                  if (!statsArr[idx]) statsArr[idx] = { label: '', value: '' };
                                  statsArr[idx].label = e.target.value;
                                  setNewProject({ ...newProject, stats: statsArr });
                                }}
                                className="px-2 py-1 border border-black text-[11px] rounded bg-white text-black font-semibold"
                              />
                              <input
                                type="text"
                                placeholder={`Giá trị ${idx + 1}`}
                                value={stat.value}
                                onChange={(e) => {
                                  const statsArr = [...(newProject.stats || [])];
                                  if (!statsArr[idx]) statsArr[idx] = { label: '', value: '' };
                                  statsArr[idx].value = e.target.value;
                                  setNewProject({ ...newProject, stats: statsArr });
                                }}
                                className="px-2 py-1 border border-black text-[11px] rounded bg-white text-black font-semibold"
                              />
                            </div>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => {
                          const existingIdx = projects.findIndex(p => p.id === newProject.id);
                          let updated: Project[] = [];
                          if (existingIdx !== -1) {
                            updated = [...projects];
                            updated[existingIdx] = newProject as Project;
                          } else {
                            updated = [...projects, newProject as Project];
                          }
                          setProjects(updated);
                          localStorage.setItem('duong_portfolio_projects', JSON.stringify(updated));
                          setEditingProjectId(null);
                          triggerSavedFeedback();
                        }}
                        className="w-full py-2.5 bg-[#FF3E00] hover:bg-[#FF3E00]/95 text-white border-2 border-black font-black text-xs uppercase rounded shadow-[2px_2px_0px_0px_#000] cursor-pointer"
                        disabled={!adminPassword.trim()}
                        style={{ opacity: adminPassword.trim() ? 1 : 0.35, cursor: adminPassword.trim() ? 'pointer' : 'not-allowed' }}
                      >
                        {adminPassword.trim() ? 'Lưu dự án công nghệ này' : '🔐 Cần mật khẩu để lưu'}
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Sticky Actions Footer */}
            <div className="p-4 border-t-4 border-black bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto text-left">
                <span className="text-[10px] font-mono font-black text-zinc-500 uppercase flex-shrink-0">
                  🔐 Mật khẩu Admin:
                </span>
                <input
                  type="password"
                  placeholder="Nhập mật khẩu..."
                  value={adminPassword}
                  onChange={(e) => {
                    setAdminPassword(e.target.value);
                    localStorage.setItem('duong_admin_password', e.target.value);
                  }}
                  className="px-2 py-1 bg-white border-2 border-black rounded text-xs font-mono font-bold w-full sm:w-36 focus:bg-amber-50/20 outline-none"
                />
              </div>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2 bg-[#E0FF00] hover:bg-[#E0FF00]/90 border-2 border-black text-black font-black text-xs uppercase tracking-wider rounded shadow-[2px_2px_0px_0px_#000] cursor-pointer transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px]"
              >
                Hoàn thành & Đóng
              </button>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
