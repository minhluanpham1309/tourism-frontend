import React from 'react';
import { Heart, Database, Cpu, Network } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white/60 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-slate-500 flex items-center gap-1.5">
            Made with <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> for Vietnam Tourism
          </p>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Network className="h-3.5 w-3.5" /> Neo4j KG
            </span>
            <span className="flex items-center gap-1">
              <Database className="h-3.5 w-3.5" /> ChromaDB
            </span>
            <span className="flex items-center gap-1">
              <Cpu className="h-3.5 w-3.5" /> PhoBERT · PhoWhisper
            </span>
          </div>

          <p className="text-xs text-slate-400">© 2026 RAG Tourism Recommender</p>
        </div>
      </div>
    </footer>
  );
};
