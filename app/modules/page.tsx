'use client';

import { useEffect, useState } from 'react';
import { Footer } from '@/app/components';
import Client from '@/app/client';
import ModuleCard from './ModuleCard';

type ModuleType = {
  name: string;
  key: string;
  github: string;
  url: string;
  description: string;
  network: string;
};

const defaultModule: ModuleType = {
  name: 'agi',
  key: 'agi',
  github: 'agi/agi',
  url: 'agi.com',
  description: 'agi module',
  network: 'eth',
};

export default function Modules() {
  const client = new Client();
  const [searchTerm, setSearchTerm] = useState('');
  const [modules, setModules] = useState<ModuleType[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newModule, setNewModule] = useState<ModuleType>(defaultModule);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchModules = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await client.call('modules');
      if (!Array.isArray(data)) {
        throw new Error('Invalid modules data');
      }
      setModules(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch modules');
      setModules([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    setLoading(true);
    setError('');
    try {
      const { name, key, github, url, description, network } = newModule;
      if (!name || !key) {
        throw new Error('Name and Key are required');
      }
      const params = { name: name, key: key, github: github, url: url, network: network };
      await client.call('add_module', params);
      setNewModule(defaultModule);
      setShowCreateForm(false);
      await fetchModules();
    } catch (err: any) {
      setError(err.message || 'Failed to create module');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setNewModule((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const filteredModules = modules.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchModules();
  }, []);

  return (
    <div className="flex flex-col items-center py-10 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {error && (
        <div className="mb-4 w-full max-w-md px-4 py-2 bg-red-500/90 backdrop-blur-md text-white rounded-lg flex justify-between items-center shadow-lg">
          <span>{error}</span>
          <button onClick={() => setError('')} className="ml-4">✕</button>
        </div>
      )}

      {/* Increased max-width and added more padding */}
      <div className="flex gap-4 items-center w-full max-w-3xl px-6 mb-12">
        <div className="flex-1 relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search modules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 text-lg rounded-lg bg-gray-800/80 backdrop-blur-md text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-lg"
            disabled={loading}
          />
        </div>
        <button
          onClick={fetchModules}
          disabled={loading}
          className="px-6 py-4 bg-indigo-500/90 backdrop-blur-md text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 shadow-lg transition-all duration-300 text-lg"
        >
          {loading ? 'Loading...' : '♻️'}
        </button>
        <button
          onClick={() => setShowCreateForm(true)}
          disabled={loading}
          className="px-6 py-4 bg-green-500/90 backdrop-blur-md text-white rounded-lg hover:bg-green-600 disabled:opacity-50 shadow-lg transition-all duration-300 text-lg"
        >
          +
        </button>
      </div>


      {showCreateForm && (
  <div className="w-full max-w-lg mb-8 p-6 bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-white/20">
    <h2 className="text-2xl font-bold mb-6 text-white">Create New Module</h2>

    {/* Essential fields with icons */}
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl">📦</span>
        <input
          placeholder="Module Name"
          value={newModule.name}
          onChange={(e) => handleFormChange('name', e.target.value)}
          className="flex-1 px-4 py-3 rounded-lg bg-gray-700/90 text-white border border-gray-600 focus:border-indigo-500 focus:outline-none"
          disabled={loading}
        />
      </div>

      <div className="flex items-center gap-3">
        <span className="text-2xl">🔑</span>
        <input
          placeholder="Module Key"
          value={newModule.key}
          onChange={(e) => handleFormChange('key', e.target.value)}
          className="flex-1 px-4 py-3 rounded-lg bg-gray-700/90 text-white border border-gray-600 focus:border-indigo-500 focus:outline-none"
          disabled={loading}
        />
      </div>

      <div className="flex items-center gap-3">
        <span className="text-2xl">💻</span>
        <input
          placeholder="GitHub URL"
          value={newModule.github}
          onChange={(e) => handleFormChange('github', e.target.value)}
          className="flex-1 px-4 py-3 rounded-lg bg-gray-700/90 text-white border border-gray-600 focus:border-indigo-500 focus:outline-none"
          disabled={loading}
        />
      </div>

      <div className="flex items-center gap-3">
        <span className="text-2xl">🌐</span>
        <input
          placeholder="Website URL"
          value={newModule.url}
          onChange={(e) => handleFormChange('url', e.target.value)}
          className="flex-1 px-4 py-3 rounded-lg bg-gray-700/90 text-white border border-gray-600 focus:border-indigo-500 focus:outline-none"
          disabled={loading}
        />
      </div>
    </div>

    <div className="flex justify-end gap-4 mt-6">
      <button
        onClick={() => {
          setShowCreateForm(false);
          setNewModule(defaultModule);
        }}
        disabled={loading}
        className="px-4 py-2 bg-gray-500/90 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors duration-200"
      >
        Cancel
      </button>
      <button
        onClick={handleCreate}
        disabled={loading}
        className="px-4 py-2 bg-green-500/90 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors duration-200"
      >
        {loading ? 'Creating...' : 'Create'}
      </button>
    </div>
  </div>
)}

      <div className="w-full max-w-[1600px] px-4 max-h-[70vh] overflow-y-auto">
        {loading && <div className="text-center py-4 text-white">Loading...</div>}
        {!loading && filteredModules.length === 0 && (
          <div className="text-center py-4 text-gray-400">
            {searchTerm ? 'No modules found' : 'No modules available'}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {!loading &&
            filteredModules.map((m: ModuleType) => (
              <ModuleCard key={m.key} module={m} />
            ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}