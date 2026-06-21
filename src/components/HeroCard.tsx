import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin, Globe, Clock, Sparkles, Radio, Heart, Github, Linkedin, ExternalLink, Facebook, Youtube, Music } from 'lucide-react';

interface HeroCardProps {
  personalInfo: any;
}

export default function HeroCard({ personalInfo }: HeroCardProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState('');

  // Update Vietnam Time (UTC+7)
  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Ho_Chi_Minh',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      const formatter = new Intl.DateTimeFormat('vi-VN', options);
      setCurrentTime(formatter.format(new Date()));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 md:p-8 rounded-2xl bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] flex flex-col justify-between h-full relative overflow-hidden group select-none text-black"
    >
      {/* Grid structure for responsive content */}
      <div className="space-y-6 relative z-10 w-full">
        {/* Status Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#E0FF00] border-2 border-black text-black text-[11px] font-black tracking-wider font-mono uppercase shadow-[2px_2px_0px_0px_#000]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF3E00] animate-ping" />
            {personalInfo.status.text}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {personalInfo.github && personalInfo.showGithub !== false && (
              <a 
                href={personalInfo.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white border-2 border-black hover:bg-[#00D1FF] text-black transition-colors duration-200 shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[1px] active:translate-y-[1px]"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {personalInfo.linkedin && personalInfo.showLinkedin !== false && (
              <a 
                href={personalInfo.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white border-2 border-black hover:bg-[#E0FF00] text-black transition-colors duration-200 shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[1px] active:translate-y-[1px]"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {personalInfo.facebook && personalInfo.showFacebook === true && (
              <a 
                href={personalInfo.facebook} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white border-2 border-black hover:bg-[#1877F2] hover:text-white text-black transition-colors duration-200 shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[1px] active:translate-y-[1px]"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            )}
            {personalInfo.zalo && personalInfo.showZalo === true && (
              <a 
                href={personalInfo.zalo} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white border-2 border-black hover:bg-[#0068FF] text-black transition-colors duration-200 shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[1px] active:translate-y-[1px]"
                title="Zalo"
              >
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADIklEQVR4nO2aTYiNURjHf4ZIBsWIGV9DWFhZWFBCorh3FGuxVKwozCA2Q7IaCwvFiCwsLH2mGVOGmJnylViQokia1MzQjMKro/9bp9t77ud57ztv3X+dbvc5/9N5/vc5H88550INNdRQLlqAbuAHECRcRuRLtlQRp8aB84GjtJcSCdNgDDgENDp4M4Dn4r4FFhIfGoHD8ikoNjIPRDYiXKgD7or3BmigOjiiPs0wK4hhkV2RMGgT5yvQTPXQpH6NjwURjkUXlinEf8uZfB4QFPCvaOJt1V8gGQQ+hKxSJExo55JiIddUd5bkEFQqZLo2xz/AYlIsZIfsj0kWQaVCzsl+wrNjfcCTagrplj0TUdfrSCd6fDrmS8gn2ZtLEPKygv5iEzIiu8mx8mE5MKplelMF/cUm5LfsE/O0nQB0iddp2U0G0A/8VKL5wpoXuf1lxR3RZyauiNTnabtHnEErkQyz6aiS21+Lg5fxKeSj7Esc7WYD38TZbdkHZGsFplkJZ5SQAQe3z6eQcMhsdbTrVH2XhlhuNl1vbawuIcMO7rBPIR2yn4yo26DJParJbqNf7Y7KwWN5hPQ7uF4jsl32RxF1rxxju1fju9g5kongmB9oW1y5Vu5e0uNw9KHlYJ9WrWf65c1JFIkNeTbXLC5Pc0R4EWJwVXVnSA6BDyGrrclXrXN6LEIMbqr+IikXssI6s28hxULQ8hhoA1xEioXUAXesy7mGtAoxmGndNN4gxUIMFohr9odUC5kjrklNqoGpcQnZLK4ZYnFiMrAf+ByHEJPh3hP3uGxLde1v0o73qm+VvRysBE5bx+zAtxCzSl0Rz+RE+4BbysNcCaJJLM/r8LUWmGcdm2fpTnkNsBe4BLzOaW9Olbt8C3nncHZUt5EbtRDs1PehPALzlUHgsjbe8IzjVUiHhs6Qwn4fOKDJH4UpwDptpNeV/X6xBH4HPuiEaBLTg8B6YFKZ/pVGTAhBsf4V89CTFObLNxPJgghvFM2b3XhDaylPb1mRx/RmZ567kkaTRPySb0W/lLWXucqMq+fpEFmFMLyYS+UfBmqooQb+4x+VPTYR6u7PTwAAAABJRU5ErkJggg==" alt="zalo" className="w-4 h-4 object-contain" />
              </a>
            )}
            {personalInfo.tiktok && personalInfo.showTiktok === true && (
              <a 
                href={personalInfo.tiktok} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white border-2 border-black hover:bg-[#000000] hover:text-white text-black transition-colors duration-200 shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[1px] active:translate-y-[1px]"
                title="TikTok"
              >
                <Music className="w-4 h-4" />
              </a>
            )}
            {personalInfo.youtube && personalInfo.showYoutube === true && (
              <a 
                href={personalInfo.youtube} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white border-2 border-black hover:bg-[#FF0000] hover:text-white text-black transition-colors duration-200 shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[1px] active:translate-y-[1px]"
                title="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Name and Designation */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-[#FF3E00] font-mono text-xs font-black tracking-widest uppercase">
            <Sparkles className="w-4 h-4 animate-spin text-[#FF3E00]" style={{ animationDuration: '4s' }} />
            <span>Xin chào, tôi là</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tight text-black italic uppercase">
            {personalInfo.fullName}
          </h1>
          <p className="text-lg md:text-xl font-black text-[#FF3E00] bg-[#FF3E00]/10 px-2 py-1.5 w-fit border border-[#FF3E00]/30 rounded-lg">
            {personalInfo.title}
          </p>
          <p className="text-sm md:text-base text-zinc-700 max-w-lg leading-relaxed font-bold">
            {personalInfo.tagline}
          </p>
        </div>
      </div>

      {/* Footer Info Hub */}
      <div className="mt-8 pt-6 border-t-2 border-black grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10 w-full">
        {/* Localization & Time */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-zinc-800 text-sm font-bold">
            <MapPin className="w-4 h-4 text-[#FF3E00]" />
            <span>{personalInfo.location}</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-700 text-xs font-bold font-mono">
            <Clock className="w-4 h-4 text-[#00D1FF]" />
            <span>Thời gian hiện tại:</span>
            <span className="text-black bg-[#00D1FF] border-2 border-black px-2 py-0.5 rounded text-[11px] font-black tracking-wide shadow-[1px_1px_0px_0px_#000]">
              {currentTime || '18:52:03'}
            </span>
          </div>
        </div>

        {/* Immersive Soundwave / Spotify Simulator Widget */}
        <div className="rounded-xl bg-white border-2 border-black p-3 flex items-center justify-between gap-3 group/spotify hover:bg-zinc-50 transition-colors shadow-[4px_4px_0px_0px_#000]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-lg bg-[#FF3E00] flex items-center justify-center relative overflow-hidden flex-shrink-0 border-2 border-black">
              <Radio className={`w-5 h-5 text-white ${isPlaying ? 'animate-bounce' : 'opacity-70'}`} />
            </div>
            <div className="overflow-hidden leading-tight">
              <div className="text-[10px] font-mono tracking-wider text-[#FF3E00] uppercase font-black flex items-center gap-1">
                <span>ON SPOTIFY</span>
                <span className="flex gap-0.5 items-end h-2 w-3">
                  <span className={`w-[2px] bg-black rounded-full ${isPlaying ? 'animate-[pulse_1s_infinite]' : 'h-1'}`} style={{ height: isPlaying ? '100%' : '15%' }} />
                  <span className={`w-[2px] bg-black rounded-full ${isPlaying ? 'animate-[pulse_1.2s_infinite]' : 'h-2'}`} style={{ height: isPlaying ? '60%' : '30%' }} />
                  <span className={`w-[2px] bg-black rounded-full ${isPlaying ? 'animate-[pulse_0.8s_infinite]' : 'h-1'}`} style={{ height: isPlaying ? '80%' : '20%' }} />
                </span>
              </div>
              <p className="text-xs font-black text-black truncate max-w-[130px]">Nàng Thơ</p>
              <p className="text-[10px] font-bold text-zinc-600 truncate max-w-[130px]">Hoàng Dũng</p>
            </div>
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-500 hover:text-black transition-colors"
            title={isPlaying ? "Tạm dừng phát nhạc" : "Phát nhạc"}
          >
            <Heart className={`w-4 h-4 ${isPlaying ? 'fill-[#FF3E00] text-[#FF3E00]' : ''}`} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
