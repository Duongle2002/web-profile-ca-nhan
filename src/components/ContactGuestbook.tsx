import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GuestbookMessage } from '../types';
import { MOCK_MESSAGES } from '../data';
import { Send, MessageSquare, Mail, Phone, Calendar, Heart, ShieldAlert, CheckCircle } from 'lucide-react';

interface ContactGuestbookProps {
  personalInfo: any;
}

export default function ContactGuestbook({ personalInfo }: ContactGuestbookProps) {
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [messageText, setMessageText] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('☕');
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const emojis = ['☕', '🚀', '🔥', '🎨', '🌟', '🍀', '💡', '🎉'];

  // Load messages from API
  useEffect(() => {
    fetch('/api/guestbook')
      .then((res) => {
        if (!res.ok) throw new Error('Không thể tải lưu bút');
        return res.json();
      })
      .then((data) => setMessages(data))
      .catch((err) => {
        console.error(err);
        setMessages(MOCK_MESSAGES);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccess(false);

    // Simple robust clientside check
    if (!name.trim()) return setErrorMsg('Vui lòng cung cấp họ tên của bạn.');
    if (!email.trim() || !email.includes('@')) return setErrorMsg('Vui lòng cung cấp email hợp lệ.');
    if (!messageText.trim() || messageText.length < 5) return setErrorMsg('Lời nhắn quá ngắn (vui lòng nhập ít nhất 5 ký tự).');

    // Create item
    const newMessage: GuestbookMessage = {
      id: `msg-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      message: messageText.trim(),
      timestamp: new Date().toISOString(),
      emoji: selectedEmoji,
      avatarSeed: Math.floor(Math.random() * 10) + 1
    };

    try {
      const response = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMessage)
      });
      if (response.ok) {
        const savedMessage = await response.json();
        setMessages((prev) => [savedMessage, ...prev]);

        // Clear inputs
        setName('');
        setEmail('');
        setMessageText('');
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
      } else {
        const err = await response.json();
        setErrorMsg(`Lỗi gửi: ${err.message || 'Không xác định'}`);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Không thể kết nối đến server để gửi tin nhắn.');
    }
  };

  const getInitials = (n: string) => {
    const parts = n.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="p-6 md:p-8 rounded-2xl bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] flex flex-col justify-between h-full relative overflow-hidden group text-black"
    >
      <div className="space-y-6">
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#FF3E00]/25 flex items-center justify-center border-2 border-black">
            <MessageSquare className="w-4 h-4 text-black" />
          </div>
          <div>
            <h2 className="text-xl font-black font-heading text-black italic uppercase">Liên hệ & Số lưu bút</h2>
            <p className="text-xs text-zinc-600 font-bold">Kết nối trực tiếp hoặc để lại chữ ký lưu niệm tại đây</p>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

          {/* Guestbook Submission Form */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-black uppercase tracking-wider text-zinc-500 text-left">
              Gửi một lời chào đến Dương
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1 text-left">
                  <label className="text-[11px] font-black text-black">Họ và tên</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Lâm Nguyễn"
                    className="w-full px-3 py-2 rounded-lg bg-white border-2 border-black focus:bg-amber-50/50 text-xs text-black font-bold outline-none placeholder:text-zinc-400 transition shadow-[2px_2px_0px_0px_#000] focus:shadow-[4px_4px_0px_0px_#000]"
                  />
                </div>
                <div className="space-y-1 text-left">
                  <label className="text-[11px] font-black text-black font-mono">Email liên hệ</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@mail.com"
                    className="w-full px-3 py-2 rounded-lg bg-white border-2 border-black focus:bg-amber-50/50 text-xs text-black font-bold outline-none placeholder:text-zinc-400 transition shadow-[2px_2px_0px_0px_#000] focus:shadow-[4px_4px_0px_0px_#000]"
                  />
                </div>
              </div>

              {/* Emoji Selector */}
              <div className="space-y-1.5 text-left">
                <label className="text-[11px] font-black text-black">Tâm trạng của bạn</label>
                <div className="flex gap-2 p-1.5 rounded-lg bg-[#FFF5E1] border-2 border-black overflow-x-auto justify-between">
                  {emojis.map((em) => (
                    <button
                      type="button"
                      key={em}
                      onClick={() => setSelectedEmoji(em)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all duration-200 outline-none cursor-pointer ${selectedEmoji === em
                        ? 'bg-[#FF3E00] text-white border-2 border-black scale-105 shadow-[2px_2px_0px_0px_#000]'
                        : 'hover:bg-zinc-200'
                        }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message text area */}
              <div className="space-y-1 text-left">
                <label className="text-[11px] font-black text-black">Lời nhắn / Đề xuất dự án</label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Viết lời chào hoặc ý tưởng bàn bạc công việc tại đây..."
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-lg bg-white border-2 border-black focus:bg-amber-50/50 text-xs text-black font-bold outline-none placeholder:text-zinc-400 transition resize-none shadow-[2px_2px_0px_0px_#000] focus:shadow-[4px_4px_0px_0px_#000]"
                />
              </div>

              {/* Banner alerts feedback */}
              <AnimatePresence mode="wait">
                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-2.5 rounded-lg bg-red-100 border-2 border-black text-[11px] text-red-900 font-bold flex items-center gap-2"
                  >
                    <ShieldAlert className="w-4 h-4 flex-shrink-0 text-red-700" />
                    <span>{errorMsg}</span>
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-2.5 rounded-lg bg-[#E0FF00] border-2 border-black text-[11px] text-black font-extrabold flex items-center gap-2 shadow-[2px_2px_0px_0px_#000]"
                  >
                    <CheckCircle className="w-4 h-4 flex-shrink-0 text-black" />
                    <span>Lời nhắn đã gửi và hiển thị trực tiếp thành công! 🎉</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-[#FF3E00] hover:bg-[#FF3E00]/95 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] transition-all"
              >
                <Send className="w-3.5 h-3.5 text-white" />
                <span>Ký lưu bút của bạn</span>
              </button>
            </form>
          </div>

          {/* Guestbook rolling feed */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-black uppercase tracking-wider text-zinc-500 flex items-center justify-between">
              <span>Bảng Lưu bút trực tiếp</span>
              <span className="text-[10px] text-zinc-500 select-none font-bold">Sắp xếp: Mới nhất</span>
            </h3>

            <div className="max-h-[300px] overflow-y-auto pr-1 space-y-3">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35 }}
                    className="p-3.5 rounded-xl bg-[#FFF5E1] border-2 border-black space-y-2 text-left shadow-[3px_3px_0px_0px_#000]"
                  >
                    <div className="flex items-center justify-between text-xs gap-2">
                      <div className="flex items-center gap-2">
                        {/* Avatar initials with responsive background colors based on seed */}
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black border border-black text-white uppercase"
                          style={{
                            backgroundColor: `hsl(${(msg.avatarSeed * 36) % 360}, 65%, 45%)`
                          }}
                        >
                          {getInitials(msg.name)}
                        </div>
                        <span className="font-black text-black truncate max-w-[120px]">{msg.name}</span>
                        <span className="px-1.5 py-0.2 rounded bg-white border border-black text-[9px] text-black font-black shadow-[1px_1px_0px_0px_#000]">{msg.emoji}</span>
                      </div>
                      <span className="text-[9px] font-mono font-black text-zinc-600">
                        {new Date(msg.timestamp).toLocaleDateString('vi-VN')}
                      </span>
                    </div>

                    <p className="text-[11px] md:text-xs text-zinc-800 font-semibold font-sans leading-relaxed tracking-wide whitespace-pre-wrap">
                      {msg.message}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

        </div>

        {/* Contact info deck footnote */}
        <div className="mt-6 pt-5 border-t-2 border-black grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 text-black font-black">
            <Mail className="w-4 h-4 text-[#00D1FF]" />
            <span className="truncate">{personalInfo.email}</span>
          </div>
          <div className="flex items-center gap-2 text-black font-black">
            <Phone className="w-4 h-4 text-[#FF3E00]" />
            <span>+84 899 370 074</span>
          </div>
          <div className="flex items-center gap-2 text-black font-black">
            <Calendar className="w-4 h-4 text-[#E0FF00]" />
            <span>Phản hồi dự án: ~4 giờ</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
