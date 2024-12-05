import { useState } from 'react';
import Link from 'next/link';

type ModuleCardProps = {
  module: {
    name: string;
    key: string;
    github: string;
    url: string;
    description: string;
    key_type: string;
  };
};

export default function ModuleCard({ module }: ModuleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      onClick={() => setIsExpanded(!isExpanded)}
      className={`
        aspect-square p-6
        rounded-2xl cursor-pointer
        border border-white/20
        bg-white/10 backdrop-blur-md
        shadow-lg
        transform transition-all duration-300
        ${isExpanded ? 'fixed inset-4 z-50 aspect-auto overflow-y-auto' : 'hover:scale-105 hover:bg-white/15'}
        flex flex-col
        w-full h-full
      `}
      style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
      }}
    >
      <div className="flex-1">
        <h3 className="text-2xl font-bold mb-4 text-white">{module.name}</h3>
        <p className="text-lg text-gray-200">{module.description}</p>
      </div>
      
      {isExpanded && (
        <div className="mt-6 space-y-4">
          <div className="p-6 bg-white/10 rounded-lg backdrop-blur-md border border-white/20">
            <p className="text-lg text-gray-200 mb-3">
              <span className="font-semibold">URL: </span>
              <Link 
                href={module.url} 
                target="_blank" 
                className="hover:text-blue-400 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {module.url}
              </Link>
            </p>
            <p className="text-lg text-gray-200 mb-3">
              <span className="font-semibold">GitHub: </span>
              <Link 
                href={module.github} 
                target="_blank" 
                className="hover:text-blue-400 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {module.github}
              </Link>
            </p>
            <p className="text-lg text-gray-200 mb-3">
              <span className="font-semibold">Key: </span>
              {module.key}
            </p>
            <p className="text-lg text-gray-200">
              <span className="font-semibold">Key Type: </span>
              {module.key_type}
            </p>
            
            <div className="mt-6">
              <iframe
                src={module.url}
                className="w-full h-[60vh] rounded-lg border border-white/20"
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