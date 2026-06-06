import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* full-bleed main: từng section trong page tự quản chiều rộng */}
      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
};
