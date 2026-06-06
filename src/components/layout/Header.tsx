import React from 'react';
import { MapPin, Github, BookOpen } from 'lucide-react';

interface HeaderProps {
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ title = 'RAG Tourism Việt Nam' }) => {
  return (
    <header className="glass-effect sticky top-0 z-50 border-b border-slate-200/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 group">
            <div className="brand-gradient flex items-center justify-center w-10 h-10 rounded-xl shadow-md shadow-pink-300/50 group-hover:scale-105 transition-transform">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-[17px] font-bold leading-tight text-slate-900">{title}</p>
              <p className="text-xs text-slate-500 leading-tight">
                Gợi ý du lịch thông minh · AI + Knowledge Graph
              </p>
            </div>
          </a>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 mr-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse-soft" />
              <span className="text-xs font-medium text-emerald-700">Hệ thống hoạt động</span>
            </div>

            <a
              href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/docs`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden md:inline">API Docs</span>
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Github className="h-4 w-4" />
              <span className="hidden md:inline">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
