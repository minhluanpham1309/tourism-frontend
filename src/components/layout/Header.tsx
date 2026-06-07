import React from 'react';
import { MapPin } from 'lucide-react';

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
        </div>
      </div>
    </header>
  );
};
