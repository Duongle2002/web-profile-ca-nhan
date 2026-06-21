import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SkillCategory } from '../types';
import { Code, Terminal, Palette, Zap, Sparkles, CheckCircle2 } from 'lucide-react';

type ChallengeType = 'none' | 'ai-chatbot' | 'realtime-collab' | 'creative-landing';

interface SkillsSandboxProps {
  skillCategories: SkillCategory[];
}

export default function SkillsSandbox({ skillCategories }: SkillsSandboxProps) {
  const [activeCategory, setActiveCategory] = useState<string>('frontend');
  const [challenge, setChallenge] = useState<ChallengeType>('none');

  // Sync activeCategory with available categories
  useEffect(() => {
    if (skillCategories.length > 0 && !skillCategories.some(c => c.id === activeCategory)) {
      setActiveCategory(skillCategories[0].id);
    }
  }, [skillCategories, activeCategory]);

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'frontend': return <Code className="w-4 h-4 text-brand-purple" />;
      case 'backend': return <Terminal className="w-4 h-4 text-brand-cyan" />;
      default: return <Palette className="w-4 h-4 text-brand-rose" />;
    }
  };

  const getCategoryColor = (id: string) => {
    switch (id) {
      case 'frontend': return 'border-brand-purple/20 bg-brand-purple/5 text-brand-purple text-brand-purple';
      case 'backend': return 'border-brand-cyan/20 bg-brand-cyan/5 text-brand-cyan';
      default: return 'border-brand-rose/20 bg-brand-rose/5 text-brand-rose';
    }
  };

  // Challenges specs
  const challenges = [
    {
      id: 'ai-chatbot' as ChallengeType,
      label: 'AI Agent Chatbot',
      desc: 'Hệ thống đàm thoại adapt thích ứng ngữ cảnh',
      highlightSkills: ['React / Next.js', 'TypeScript / JS ES6+', 'Node.js (Express / NestJS)', 'Integration LLM Agent (Gemini API)'],
      tip: 'Lời khuyên từ Dương: Khi làm chatbot, chìa khóa nằm ở Streaming response để hiển thị chữ chạy mượt mà và tối ưu hóa System Prompt của LLM!'
    },
    {
      id: 'realtime-collab' as ChallengeType,
      label: 'Bảng cộng tác Realtime',
      desc: 'Ứng dụng làm việc nhóm đa người dùng đồng thời',
      highlightSkills: ['React / Next.js', 'Node.js (Express / NestJS)', 'PostgreSQL / MongoDB / Firebase', 'RESTful API / GraphQL'],
      tip: 'Lời khuyên từ Dương: Sử dụng WebSockets hoặc Firestore Live Listeners giúp đồng bộ trạng thái giữa các bên tức thì mà không lãng phí băng thông!'
    },
    {
      id: 'creative-landing' as ChallengeType,
      label: 'Creative Showcase',
      desc: 'Landing page giới thiệu nghệ thuật chuyển động',
      highlightSkills: ['React / Next.js', 'Tailwind CSS v4 & SCSS', 'Framer Motion / GSAP', 'UI/UX Design on Figma'],
      tip: 'Lời khuyên từ Dương: Đừng lạm dụng quá nhiều hiệu ứng quay cuồng. Hãy dùng micro-interactions ở khoảng cách nhỏ 2-4px để tạo cảm giác tinh xảo!'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="p-6 md:p-8 rounded-2xl bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] flex flex-col justify-between h-full relative overflow-hidden group text-black"
    >
      <div className="space-y-6">
        {/* Title */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FFD600] flex items-center justify-center border-2 border-black">
              <Zap className="w-4 h-4 text-black" />
            </div>
            <div>
              <h2 className="text-xl font-black font-heading text-black italic uppercase">Năng lực Công nghệ</h2>
              <p className="text-xs text-zinc-600 font-bold">Xem cấp bậc kỹ năng hoặc thử công cụ ghép nối dự án</p>
            </div>
          </div>

          <div className="inline-flex rounded-xl bg-[#FFF5E1] border-2 border-black p-1">
            {skillCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setChallenge('none'); // clear challenge focus
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-black tracking-wider transition-all duration-300 cursor-pointer outline-none ${
                  activeCategory === cat.id && challenge === 'none'
                    ? 'bg-[#FF3E00] border-2 border-black text-white shadow-[2px_2px_0px_0px_#000]'
                    : 'text-zinc-600 hover:text-black'
                }`}
              >
                {cat.name.split(' ')[0]} {/* shortened display */}
              </button>
            ))}
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* List of Skills */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-black uppercase tracking-wider text-zinc-500">
              {challenge !== 'none' 
                ? 'Công nghệ đề xuất cho giải pháp'
                : skillCategories.find(c => c.id === activeCategory)?.name
              }
            </h3>

            <div className="space-y-3.5">
              {(challenge !== 'none' 
                ? skillCategories.flatMap(c => c.skills)
                : skillCategories.find(c => c.id === activeCategory)?.skills || []
              ).map((skill, index) => {
                const isHighlightedByChallenge = challenge !== 'none' && 
                  challenges.find(ch => ch.id === challenge)?.highlightSkills.includes(skill.name);
                
                // If a challenge is active, soften non-relevant ones
                const opacity = challenge === 'none' ? 'opacity-100' : (isHighlightedByChallenge ? 'opacity-100' : 'opacity-30');
                const glowBorder = isHighlightedByChallenge ? 'border-black bg-[#00D1FF]/10' : 'border-zinc-300 bg-white';

                return (
                  <div 
                    key={index} 
                    className={`space-y-1.5 transition-all duration-300 ${opacity} p-2.5 rounded-xl border-2 shadow-[2px_2px_0px_0px_#000] ${glowBorder}`}
                  >
                    <div className="flex items-center justify-between text-xs sm:text-sm font-black text-black">
                      <span className="flex items-center gap-1.5">
                        {isHighlightedByChallenge && <CheckCircle2 className="w-3.5 h-3.5 text-[#FF3E00] flex-shrink-0" />}
                        {skill.name}
                      </span>
                      <span className="text-black font-mono font-black text-xs">{skill.level}%</span>
                    </div>
                    
                    {/* Progress Bar background */}
                    <div className="h-2 w-full bg-[#FFF5E1] rounded-lg border border-black overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`h-full rounded-r-sm ${
                          isHighlightedByChallenge 
                            ? 'bg-[#00D1FF]' 
                            : 'bg-[#FF3E00]'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Challenge Forge */}
          <div className="rounded-xl bg-[#FFF5E1] border-2 border-black p-5 space-y-4 flex flex-col justify-between shadow-[4px_4px_0px_0px_#000]">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#00D1FF] border-2 border-black text-black text-[10px] font-black uppercase tracking-wider shadow-[1px_1px_0px_0px_#000]">
                <Sparkles className="w-3 h-3 text-black" />
                <span>Thú vị & Khác biệt</span>
              </div>
              <h4 className="text-sm font-black text-black text-left">Bạn đang lên kế hoạch chế tạo sản phẩm gì?</h4>
              <p className="text-xs text-zinc-700 font-bold leading-normal text-left">Chọn 1 kịch bản để Dương tư vấn cấu hình stack công nghệ ứng dụng phù hợp nhất:</p>
            </div>

            {/* Selection Buttons */}
            <div className="flex flex-col gap-2">
              {challenges.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setChallenge(ch.id)}
                  className={`p-3 text-left rounded-xl border-2 text-xs transition duration-200 cursor-pointer ${
                    challenge === ch.id
                      ? 'border-black bg-[#E0FF00] text-black shadow-[2px_2px_0px_0px_#000] font-black'
                      : 'border-zinc-300 bg-white hover:border-black text-zinc-900 font-bold'
                  }`}
                >
                  <p className="font-black text-black">{ch.label}</p>
                  <p className="text-[10px] text-zinc-600 font-bold truncate mt-0.5">{ch.desc}</p>
                </button>
              ))}
            </div>

            {/* Tư vấn feedback from Duong */}
            <div className="min-h-[70px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                {challenge !== 'none' ? (
                  <motion.div
                    key={challenge}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-3 rounded-lg bg-white border-2 border-black text-xs text-black font-semibold italic leading-relaxed shadow-[3px_3px_0px_0px_#000]"
                  >
                    {challenges.find(ch => ch.id === challenge)?.tip}
                  </motion.div>
                ) : (
                  <p className="text-xs text-zinc-500 font-bold italic text-center">
                    Gợi ý: Click một kịch bản phía trên để xem sơ đồ nhắm mục tiêu công nghiệp
                  </p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
