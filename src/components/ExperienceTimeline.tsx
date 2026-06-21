import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Experience } from '../types';
import { Briefcase, GraduationCap, Calendar, Plus, Minus, Pin } from 'lucide-react';

interface ExperienceTimelineProps {
  experiences: Experience[];
}

export default function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'work' | 'education'>('all');
  const [expandedId, setExpandedId] = useState<string | null>("exp-1");

  const filteredExperiences = activeFilter === 'all'
    ? experiences
    : experiences.filter(exp => exp.type === activeFilter);

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="p-6 md:p-8 rounded-2xl bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] flex flex-col justify-between h-full relative overflow-hidden group text-black"
    >
      <div className="space-y-6">
        {/* Title & Filter Header */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#E0FF00]/30 flex items-center justify-center border-2 border-black">
              <Briefcase className="w-4 h-4 text-black" />
            </div>
            <div>
              <h2 className="text-xl font-black font-heading text-black italic uppercase">Lịch sử Hành trình</h2>
              <p className="text-xs text-zinc-600 font-bold">Hành trình tích lũy trí tuệ và kinh nghiệm thực chiến</p>
            </div>
          </div>

          <div className="flex bg-[#FFF5E1] p-1 rounded-lg border-2 border-black">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-md text-xs font-black transition duration-200 cursor-pointer outline-none ${
                activeFilter === 'all' ? 'bg-[#E0FF00] border-2 border-black text-black shadow-[2px_2px_0px_0px_#000]' : 'text-zinc-700 hover:text-black'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setActiveFilter('work')}
              className={`px-3 py-1.5 rounded-md text-xs font-black transition duration-200 cursor-pointer outline-none ${
                activeFilter === 'work' ? 'bg-[#E0FF00] border-2 border-black text-black shadow-[2px_2px_0px_0px_#000]' : 'text-zinc-700 hover:text-black'
              }`}
            >
              Làm việc
            </button>
            <button
              onClick={() => setActiveFilter('education')}
              className={`px-3 py-1.5 rounded-md text-xs font-black transition duration-200 cursor-pointer outline-none ${
                activeFilter === 'education' ? 'bg-[#E0FF00] border-2 border-black text-black shadow-[2px_2px_0px_0px_#000]' : 'text-zinc-700 hover:text-black'
              }`}
            >
              Học vấn
            </button>
          </div>
        </div>

        {/* Timeline Path Line - heavy black outline style */}
        <div className="relative border-l-4 border-black ml-4 pl-6 md:pl-8 space-y-6 py-2">
          {filteredExperiences.map((exp, index) => {
            const isExpanded = expandedId === exp.id;
            const isWork = exp.type === 'work';

            return (
              <div key={exp.id} className="relative group/timeline text-left">
                {/* Visual Timeline Bulb node */}
                <div 
                  className={`absolute top-2 w-5 h-5 rounded-full border-2 border-black transition-all duration-300 flex items-center justify-center ${
                    isExpanded 
                      ? 'bg-[#E0FF00] scale-110 shadow-[2px_2px_0px_0px_#000]' 
                      : 'bg-white hover:bg-zinc-100'
                  }`}
                  style={{ left: '-33px' }} // exact alignment top line
                >
                  <span className={`w-2 h-2 rounded-full bg-[#FF3E00] ${isExpanded ? 'scale-100' : 'scale-0'} transition-transform`} />
                </div>

                {/* Timeline Card */}
                <div 
                  onClick={() => toggleExpand(exp.id)}
                  className={`p-4 md:p-5 rounded-xl border-2 transition-all duration-300 cursor-pointer select-none ${
                    isExpanded 
                      ? 'bg-[#FFF5E1] border-black shadow-[4px_4px_0px_0px_#000]' 
                      : 'bg-white border-zinc-300 hover:border-black hover:bg-zinc-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      {/* Sub-label role & company */}
                      <span className="inline-flex items-center gap-1.5 text-xs text-[#FF3E00] font-mono font-black tracking-wider uppercase">
                        {isWork ? <Briefcase className="w-3.5 h-3.5" /> : <GraduationCap className="w-3.5 h-3.5" />}
                        {exp.company}
                      </span>
                      <h3 className="text-sm md:text-base font-black text-black tracking-tight uppercase italic">
                        {exp.role}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-zinc-600 font-bold font-mono">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{exp.duration}</span>
                      </div>
                    </div>

                    <button className="p-1 rounded-lg border border-black bg-white text-black hover:bg-zinc-100 transition duration-200 flex-shrink-0 cursor-pointer shadow-[1px_1px_0px_0px_#000]">
                      {isExpanded ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </button>
                  </div>

                  <p className="text-xs text-zinc-800 font-semibold leading-normal mt-3.5">
                    {exp.description}
                  </p>

                  {/* Skills badges */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {exp.skills.map((skill, i) => (
                      <span 
                        key={i} 
                        className="px-1.5 py-0.5 rounded bg-white border border-black text-[9px] font-mono font-black text-black shadow-[1px_1px_0px_0px_#000]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Bullet points Expanded Area */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: 'auto', opacity: 1, marginTop: 14 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden border-t-2 border-black pt-3.5 space-y-2.5"
                      >
                        {exp.details.map((detail, dIdx) => (
                          <div key={dIdx} className="flex items-start gap-2.5 text-[11px] md:text-xs text-zinc-800 leading-relaxed font-semibold font-sans">
                            <Pin className="w-3 h-3 text-[#FF3E00] flex-shrink-0 mt-1 transform rotate-45" />
                            <span>{detail}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
