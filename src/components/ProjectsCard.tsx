import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project } from '../types';
import { ExternalLink, Github, Layers, ArrowUpRight, CheckCircle, Flame, Star } from 'lucide-react';

interface ProjectsCardProps {
  projects: Project[];
}

export default function ProjectsCard({ projects }: ProjectsCardProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'ai' | 'web' | 'mobile'>('all');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Auto-select first project on mount or when projects update
  useEffect(() => {
    if (projects.length > 0 && (!selectedProjectId || !projects.some(p => p.id === selectedProjectId))) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  // Categories list
  const categories: { id: 'all' | 'ai' | 'web' | 'mobile'; label: string }[] = [
    { id: 'all', label: 'Tất cả dự án' },
    { id: 'ai', label: 'Màng lọc AI' },
    { id: 'web', label: 'Web Platform' },
    { id: 'mobile', label: 'Mobile App' }
  ];

  // Filtering projects
  const filteredProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  const selectedProject = projects.find(p => p.id === selectedProjectId) || filteredProjects[0] || null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="p-6 md:p-8 rounded-2xl bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] flex flex-col justify-between h-full relative overflow-hidden group text-black"
    >
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#00D1FF]/25 flex items-center justify-center border-2 border-black">
              <Layers className="w-4 h-4 text-black" />
            </div>
            <div>
              <h2 className="text-xl font-black font-heading text-black italic uppercase">Dự án tiêu biểu</h2>
              <p className="text-xs text-zinc-600 font-bold">Click chọn từng dự án để xem phân tích chi tiết</p>
            </div>
          </div>

          {/* Quick filter switcher */}
          <div className="flex flex-wrap gap-1 bg-[#FFF5E1] p-1 rounded-lg border-2 border-black">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  const match = projects.find(p => cat.id === 'all' || p.category === cat.id);
                  if (match) setSelectedProjectId(match.id);
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-black transition-all duration-200 outline-none cursor-pointer ${
                  activeCategory === cat.id 
                    ? 'bg-[#00D1FF] border-2 border-black text-black shadow-[2px_2px_0px_0px_#000]' 
                    : 'text-zinc-700 hover:text-black'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Interactive Showroom Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[360px]">
          {/* Projects Left Thumb List */}
          <div className="lg:col-span-5 flex flex-col gap-2.5 max-h-[380px] overflow-y-auto pr-1">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => {
                const isSelected = selectedProject?.id === project.id;
                return (
                  <motion.div
                    layout
                    key={project.id}
                    onClick={() => setSelectedProjectId(project.id)}
                    className={`relative p-4 rounded-xl cursor-pointer border-2 transition-all duration-300 flex items-center gap-4 group/item select-none ${
                      isSelected 
                        ? 'bg-[#00D1FF]/15 border-black shadow-[4px_4px_0px_0px_#000] translate-x-[-2px] translate-y-[-2px]' 
                        : 'bg-white border-zinc-300 hover:border-black hover:bg-zinc-50'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-200 flex-shrink-0 relative border border-black">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      {project.featured && (
                        <div className="absolute top-0.5 right-0.5 bg-[#FF3E00] p-0.5 rounded-full border border-black" title="Tiêu biểu">
                          <Star className="w-2.5 h-2.5 fill-white text-white" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 overflow-hidden">
                      <h4 className="text-sm font-black text-black truncate group-hover/item:text-[#FF3E00] transition-colors">
                        {project.title}
                      </h4>
                      <p className="text-xs text-zinc-600 font-bold truncate mt-0.5">{project.subtitle}</p>
                    </div>

                    <div className="flex-shrink-0">
                      <ArrowUpRight className={`w-4 h-4 transition-transform duration-300 ${
                        isSelected ? 'text-[#FF3E00] translate-x-0.5 -translate-y-0.5 font-bold' : 'text-zinc-400 group-hover/item:text-black'
                      }`} />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {filteredProjects.length === 0 && (
              <div className="text-center py-12 text-zinc-500 text-sm font-bold font-mono">
                Chưa có dữ liệu dự án cho lĩnh vực này.
              </div>
            )}
          </div>

          {/* Details Right Display Panel */}
          <div className="lg:col-span-7 bg-[#FFF5E1] border-2 border-black rounded-xl p-5 md:p-6 flex flex-col justify-between relative overflow-hidden shadow-[4px_4px_0px_0px_#000]">
            <AnimatePresence mode="wait">
              {selectedProject ? (
                <motion.div
                  key={selectedProject.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5 h-full flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProject.tags.map((tag, i) => (
                        <span 
                          key={i} 
                          className="px-2.5 py-0.5 rounded bg-white border border-black text-[10px] font-mono font-black text-black shadow-[1px_1px_0px_0px_#000]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Description */}
                    <div className="space-y-1 text-left">
                      <h3 className="text-xl font-black font-heading text-black tracking-tight italic uppercase flex items-center gap-2">
                        {selectedProject.title}
                      </h3>
                      <p className="text-xs text-[#FF3E00] font-black font-mono tracking-wider uppercase mb-2">
                        {selectedProject.subtitle}
                      </p>
                      <p className="text-xs md:text-sm text-zinc-800 leading-relaxed font-semibold font-sans">
                        {selectedProject.longDescription}
                      </p>
                    </div>

                    {/* Internal Interactive Stat Numbers */}
                    <div className="grid grid-cols-3 gap-3.5 pt-2">
                      {selectedProject.stats.map((stat, i) => (
                        <div key={i} className="p-2 w-full rounded-lg bg-white border-2 border-black text-center shadow-[2px_2px_0px_0px_#000]">
                          <p className="text-[9px] text-zinc-600 uppercase tracking-widest font-mono font-black truncate">{stat.label}</p>
                          <p className="text-sm md:text-base font-black text-black mt-1">{stat.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-4 border-t-2 border-black mt-auto">
                    <a
                      href={selectedProject.demoUrl || '#'}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#E0FF00] hover:bg-[#E0FF00]/95 text-black font-black border-2 border-black text-xs md:text-sm transition-all duration-300 shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4 text-black" />
                      <span>Trải nghiệm Demo</span>
                    </a>
                    
                    <a
                      href={selectedProject.githubUrl || '#'}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-zinc-50 text-black font-black border-2 border-black text-xs md:text-sm transition-all duration-300 shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                    >
                      <Github className="w-4 h-4 text-black" />
                      <span>Github</span>
                    </a>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 py-12">
                  <Flame className="w-10 h-10 text-[#FF3E00] animate-bounce duration-1000 opacity-60 mb-3" />
                  <p className="text-xs font-bold">Hãy chọn một ứng dụng bên trái để khai thác nguồn gốc mã!</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
