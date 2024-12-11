'use client';

import { useState } from 'react';
import Link from 'next/link';

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
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const formatUrl = (url: string) => {
    return url.startsWith('http') ? url : `http://${url}`;
  };

  const formatGithub = (github: string) => {
    return github.startsWith('http') ? github : `https://github.com/${github}`;
  };

  const handleCopy = (text: string, field: string) => {
    copyToClipboard(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div
      onClick={() => setIsExpanded(!isExpanded)}
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
        ${isExpanded ? 'fixed inset-4 z-50 overflow-y-auto' : 'hover:bg-white/10 hover:scale-105'}
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

      <div className="flex flex-col gap-2 mb-4">
        <p className="text-white/70 text-base">
          {module.description}
        </p>
      </div>

      <div className="mt-auto space-y-2">
        {/* URL Row */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌐</span>
          <div className="flex-1 bg-black/60 rounded-lg p-2 flex justify-between items-center">
            <span className="text-white truncate">{module.url}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopy(module.url, 'url');
              }}
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
              onClick={(e) => {
                e.stopPropagation();
                handleCopy(module.github, 'github');
              }}
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
              onClick={(e) => {
                e.stopPropagation();
                handleCopy(module.key, 'key');
              }}
              className="ml-2 text-white/70 hover:text-white"
            >
              {copiedField === 'key' ? '✓' : '📋'}
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-6 space-y-4">
          <div className="p-6 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
            <div className="mt-2">
              <iframe
                src={formatUrl(module.url)}
                className="w-full h-[70vh] rounded-xl border border-white/20"
                title={module.name}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}