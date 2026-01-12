
import React, { useState } from 'react';
import { KnowledgeLevel } from '../types';

interface SetupScreenProps {
  onStart: (topic: string, level: KnowledgeLevel) => void;
  isLoading: boolean;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onStart, isLoading }) => {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState<KnowledgeLevel>('Beginner');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onStart(topic.trim(), level);
    }
  };

  const suggestions = ["World History", "Physics", "React Development", "Psychology", "Italian Cuisine"];
  const levels: KnowledgeLevel[] = ['Beginner', 'Intermediate', 'Advanced'];

  return (
    <div className="max-w-xl mx-auto px-6 py-12 text-center animate-in fade-in zoom-in duration-500">
      <div className="mb-10 inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-200 rotate-3 mb-6 transition-transform hover:rotate-0">
        <span className="text-3xl text-white font-black">T</span>
      </div>
      
      <h1 className="text-4xl font-outfit font-bold text-slate-800 mb-2 tracking-tight">
        Teca <span className="text-indigo-600">MCQ</span>
      </h1>
      <p className="text-slate-500 mb-10">
        Level up your knowledge with AI-powered tutoring.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6 text-left">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">What do you want to learn?</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Quantum Mechanics"
            disabled={isLoading}
            className="w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl text-lg font-medium shadow-sm transition-all focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Your current level</label>
          <div className="grid grid-cols-3 gap-3">
            {levels.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLevel(l)}
                className={`py-3 rounded-xl font-bold border-2 transition-all ${
                  level === l 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' 
                    : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-200'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !topic.trim()}
          className="w-full py-5 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:translate-y-0 disabled:opacity-50"
        >
          {isLoading ? 'Preparing Quiz...' : 'Start Learning Session'}
        </button>
      </form>

      <div className="mt-10">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Popular Topics</p>
        <div className="flex flex-wrap justify-center gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => setTopic(s)}
              className="px-4 py-2 bg-white border border-slate-100 hover:border-indigo-200 text-slate-600 hover:text-indigo-600 rounded-full text-xs font-bold shadow-sm transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SetupScreen;
