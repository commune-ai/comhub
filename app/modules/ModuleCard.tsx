'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type ModuleType = {
  name: string;
  key: string;
  github: string;
  url: string;
  description: string;
  key_type: string;
};

type ModuleCardProps = {
  module: ModuleType;
};

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).catch(() => {
    console.error('Failed to copy to clipboard');
  });
}

export default function ModuleCard({ module }: ModuleCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, text: string, field: string) => {
    e.stopPropagation();
    copyToClipboard(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div
      onClick={() => router.push(`/modules/${module.name}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setHoveredIcon(null);
      }}
      className={`
        p-6 rounded-2xl cursor-pointer
        border border-white/20
        bg-white/5 backdrop-blur-md
        shadow-lg
        transform transition-all duration-300
        hover:bg-white/10 hover:scale-105
        flex flex-col
        relative
      `}
      style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-xl text-white font-semibold truncate">
          {module.name}
        </div>
      </div>

      <div className="mt-auto space-y-2">
        {/* URL Row */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌐</span>
          <div className="flex-1 bg-black/60 rounded-lg p-2 flex justify-between items-center">
            <span className="text-white truncate">{module.url}</span>
            <button
              onClick={(e) => handleCopy(e, module.url, 'url')}
              className="ml-2 text-white/70 hover:text-white"
            >
              {copiedField === 'url' ? '✓' : '📋'}
            </button>
          </div>
        </div>

        {/* GitHub Row */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">📦</span>
          <div className="flex-1 bg-black/60 rounded-lg p-2 flex justify-between items-center">
            <span className="text-white truncate">{module.github}</span>
            <button
              onClick={(e) => handleCopy(e, module.github, 'github')}
              className="ml-2 text-white/70 hover:text-white"
            >
              {copiedField === 'github' ? '✓' : '📋'}
            </button>
          </div>
        </div>

        {/* Key Row */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔑</span>
          <div className="flex-1 bg-black/60 rounded-lg p-2 flex justify-between items-center">
            <span className="text-white truncate">{module.key}</span>
            <button
              onClick={(e) => handleCopy(e, module.key, 'key')}
              className="ml-2 text-white/70 hover:text-white"
            >
              {copiedField === 'key' ? '✓' : '📋'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}