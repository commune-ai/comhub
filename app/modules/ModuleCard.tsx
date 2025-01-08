'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type ModuleType = {
  name: string;
  key: string;
  github: string;
  address: string;
  description: string;
  key_type: string;
  hash: string;
};

type ModuleCardProps = {
  module: ModuleType;
};

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).catch(() => {
    console.error('Failed to copy to clipboard');
  });
}

function abbreviateString(str: string, maxLength = 8): string {
  if (str.length <= maxLength) return str;
  return `${str.substring(0, maxLength)}…`;
}

function AbbreviateOnHover({
  text,
  maxLength = 8,
}: {
  text: string;
  maxLength?: number;
}) {
  const abbreviated = abbreviateString(text, maxLength);

  return (
    <span className="relative group">
      <span className="group-hover:opacity-0 transition-opacity">
        {abbreviated}
      </span>
      <span
        className={`
          absolute inset-0 
          opacity-0 group-hover:opacity-100 
          transition-opacity
        `}
      >
        {text}
      </span>
    </span>
  );
}

export default function ModuleCard({ module }: ModuleCardProps) {
  const router = useRouter();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (
    e: React.MouseEvent<HTMLButtonElement>,
    text: string,
    field: string
  ) => {
    e.stopPropagation();
    copyToClipboard(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div
      onClick={() => router.push(`/modules/${module.key}`)}
      className={`
        relative p-6 rounded-2xl cursor-pointer
        border border-white/10
        bg-gradient-to-br from-gray-800/90 to-gray-900/90
        backdrop-blur-md
        shadow-xl
        transform transition-all duration-300 ease-in-out
        hover:scale-[1.02] hover:shadow-2xl
        hover:border-white/20
        group
      `}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

      {/* Header */}
      <div className="relative flex items-center justify-between mb-6">
        <div className="text-xl text-white font-bold truncate bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          {/* Use AbbreviateOnHover for the name */}
          <AbbreviateOnHover text={module.name} maxLength={12} />
        </div>
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 opacity-75 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div className="relative mt-auto space-y-3">
        {/* URL Row */}
        <div className="flex items-center gap-3 group/item">
          <span className="text-2xl transform transition-transform group-hover/item:scale-110">
            🌐
          </span>
          <div className="flex-1 bg-black/40 rounded-xl p-3 backdrop-blur-sm border border-white/5 group-hover:border-white/10 transition-all">
            <div className="flex justify-between items-center">
              <span className="text-white/90 truncate text-sm">
                <AbbreviateOnHover text={module.hash} maxLength={28} />
              </span>
              <button
                onClick={(e) => handleCopy(e, module.hash, 'hash')}
                className="ml-2 text-white/50 hover:text-white/90 transition-colors"
              >
                {copiedField === 'hash' ? '✓' : '📋'}
              </button>
            </div>
          </div>
        </div>

        {/* Key Row */}
        <div className="flex items-center gap-3 group/item">
          <span className="text-2xl transform transition-transform group-hover/item:scale-110">
            🔑
          </span>
          <div className="flex-1 bg-black/40 rounded-xl p-3 backdrop-blur-sm border border-white/5 group-hover:border-white/10 transition-all">
            <div className="flex justify-between items-center">
              <span className="text-white/90 truncate text-sm">
                <AbbreviateOnHover text={module.key} maxLength={28} />
              </span>
              <button
                onClick={(e) => handleCopy(e, module.key, 'key')}
                className="ml-2 text-white/50 hover:text-white/90 transition-colors"
              >
                {copiedField === 'key' ? '✓' : '📋'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
