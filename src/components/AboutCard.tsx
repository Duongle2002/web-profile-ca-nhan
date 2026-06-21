import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Lightbulb, Compass, Milestone, Cpu } from 'lucide-react';

type TabId = 'story' | 'philosophy' | 'milestones';

interface AboutCardProps {
  personalInfo: any;
}

export default function AboutCard({ personalInfo }: AboutCardProps) {
  const [activeTab, setActiveTab] = useState<TabId>('story');

  const tabs = [
    { id: 'story' as TabId, label: 'Tiểu sử', icon: User },
    { id: 'philosophy' as TabId, label: 'Triết lý sáng tạo', icon: Lightbulb },
    { id: 'milestones' as TabId, label: 'Mục tiêu 2026', icon: Milestone },
  ];

  const contentMap = {
    story: {
      title: "Hành trình & Tư duy sáng tạo",
      body: personalInfo.aboutLong,
      factoids: [
        { label: "Bắt đầu code", value: "Từ 2019" },
        { label: "Tuổi đời", value: "24 tuổi (Sinh năm 2002)" },
        { label: "Điểm mạnh", value: "Tư duy hệ thống & UX" },
      ]
    },
    philosophy: {
      title: "Thế giới quan Thiết kế độc đáo",
      body: "Một giao diện đẹp không chỉ là những dải màu phong cách hay font chữ thời thượng, mà là cách nó trò chuyện với người dùng qua từng hành động click. Tôi tin vào sự tối giản thông minh, nơi mọi thành phần đều có lý do để tồn tại và trải nghiệm được cá nhân hóa cao độ để chạm đến cảm xúc.",
      factoids: [
        { label: "Nguyên lý cốt lõi", value: "Tối giản" },
        { label: "Trọng tâm", value: "Mượt mà (60fps animation)" },
        { label: "Tôn chỉ", value: "Chống rập khuôn thiết kế" },
      ]
    },
    milestones: {
      title: "Mục tiêu & Đích đến Công nghệ",
      body: "Trong năm 2026, tôi tập trung đi sâu vào khả năng nhúng Generative AI thông minh trực tiếp vào các môi trường UI/UX thời gian thực (Real-time Adaptive Interfaces) và nghiên cứu kĩ thuật tối ưu hóa mã nguồn biên dịch WebAssembly để mang đến thế hệ ứng dụng siêu web.",
      factoids: [
        { label: "Công nghệ then chốt", value: "WASM & WebAgent AI" },
        { label: "Nghiên cứu phụ", value: "Adaptive UI Theme" },
        { label: "Khao khát", value: "Nâng tầm Web Việt" },
      ]
    }
  };

  const currentContent = contentMap[activeTab];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="p-6 md:p-8 rounded-2xl bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] flex flex-col justify-between h-full relative overflow-hidden group text-black"
    >
      <div className="space-y-6">
        {/* Card Header Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#FF3E00]/15 flex items-center justify-center border-2 border-black">
            <Compass className="w-4 h-4 text-[#FF3E00]" />
          </div>
          <h2 className="text-xl font-black font-heading text-black italic uppercase">
            Khám phá {personalInfo.fullName}
          </h2>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1.5 p-1 rounded-xl bg-[#FFF5E1] border-2 border-black overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-black transition-all duration-300 whitespace-nowrap outline-none cursor-pointer ${
                  isActive ? 'text-white' : 'text-zinc-800 hover:text-black'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabBackground"
                    className="absolute inset-0 bg-[#FF3E00] border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000]"
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  />
                )}
                <Icon className="w-3.5 h-3.5 relative z-10" />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div className="min-h-[140px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.2 }}
              className="space-y-3.5"
            >
              <h3 className="text-base font-black text-[#FF3E00] flex items-center gap-1.5 leading-snug uppercase tracking-tight">
                <Cpu className="w-4 h-4 text-[#FF3E00]" />
                <span className="underline decoration-[#E0FF00] decoration-4 underline-offset-4">{currentContent.title}</span>
              </h3>
              <p className="text-zinc-800 font-sans text-sm md:text-base leading-relaxed tracking-wide font-medium">
                {currentContent.body}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Structured metrics/facts */}
      <div className="mt-6 pt-5 border-t-2 border-black grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {currentContent.factoids.map((fact, index) => (
          <div key={index} className="p-3 rounded-xl bg-[#FFF5E1] border-2 border-black space-y-1 shadow-[3px_3px_0px_0px_#000]">
            <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 font-black">
              {fact.label}
            </p>
            <p className="text-xs font-black text-black truncate">
              {fact.value}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
