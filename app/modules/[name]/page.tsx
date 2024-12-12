'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Client from '@/app/client';

type ModuleType = {
  name: string;
  key: string;
  github: string;
  url: string;
  description: string;
  network: string;
};

export default function ModulePage({ params }: { params: { name: string } }) {
  const router = useRouter();
  const [module, setModule] = useState<ModuleType | null>(null);
  const [loading, setLoading] = useState(true);
  const client = new Client();

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const modules = await client.call('modules');
        const foundModule = modules.find((m: ModuleType) => m.name === params.name);
        if (foundModule) {
          setModule(foundModule);
        }
      } catch (error) {
        console.error('Failed to fetch module:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchModule();
  }, [params.name]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!module) {
    return <div>Module not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-8 text-white hover:text-gray-300"
        >
          ← Back
        </button>

        <div className="bg-gray-800/90 rounded-2xl p-8 shadow-2xl border border-white/20">
          <h1 className="text-4xl font-bold text-white mb-8">{module.name}</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* URL Card */}
            <div className="bg-black/40 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-2">URL</h3>
              <div className="bg-black/60 rounded-lg p-3">
                <span className="text-white">{module.url}</span>
              </div>
            </div>

            {/* GitHub Card */}
            <div className="bg-black/40 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-2">GitHub</h3>
              <div className="bg-black/60 rounded-lg p-3">
                <span className="text-white">{module.github}</span>
              </div>
            </div>

            {/* Key Card */}
            <div className="bg-black/40 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-2">Key</h3>
              <div className="bg-black/60 rounded-lg p-3">
                <span className="text-white">{module.key}</span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Preview</h2>
            <iframe
              src={module.url.startsWith('http') ? module.url : `http://${module.url}`}
              className="w-full h-[600px] rounded-xl border border-white/20"
              title={module.name}
            />
          </div>
        </div>
      </div>
    </div>
  );
}