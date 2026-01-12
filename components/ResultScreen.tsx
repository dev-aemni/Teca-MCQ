
import React from 'react';
import { QuizProgress } from '../types';

interface ResultScreenProps {
  progress: QuizProgress;
  onRestart: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ progress, onRestart }) => {
  const scorePercentage = Math.round((progress.score / 10) * 100);
  
  const getFeedback = () => {
    if (scorePercentage >= 90) return { title: "Genius Status!", msg: "You've mastered this topic at an elite level!", color: "text-indigo-600", icon: "💎" };
    if (scorePercentage >= 70) return { title: "Excellent Work!", msg: "A very strong performance. You know your stuff!", color: "text-emerald-600", icon: "🚀" };
    if (scorePercentage >= 50) return { title: "Solid Progress!", msg: "You're getting there. A bit more practice and you'll be a pro.", color: "text-amber-600", icon: "📈" };
    return { title: "Keep Growing!", msg: "Every mistake is a learning opportunity. Ready for another round?", color: "text-rose-600", icon: "🎯" };
  };

  const feedback = getFeedback();

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-8xl mb-8 transform hover:scale-110 transition-transform cursor-default">{feedback.icon}</div>
      <h2 className={`text-5xl font-outfit font-black mb-4 ${feedback.color}`}>{feedback.title}</h2>
      <p className="text-lg text-slate-500 mb-12 font-medium">{feedback.msg}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-100 border border-slate-50">
          <p className="text-[10px] text-slate-400 uppercase font-black mb-1">Correct</p>
          <p className="text-4xl font-black text-emerald-500">{progress.score}</p>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-100 border border-slate-50">
          <p className="text-[10px] text-slate-400 uppercase font-black mb-1">Incorrect</p>
          <p className="text-4xl font-black text-rose-500">{progress.incorrect}</p>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-100 border border-slate-100">
          <p className="text-[10px] text-slate-400 uppercase font-black mb-1">Final Grade</p>
          <p className="text-4xl font-black text-indigo-600">{scorePercentage}%</p>
        </div>
      </div>

      <div className="inline-flex items-center space-x-2 text-slate-400 font-bold mb-8 p-4 bg-slate-50 rounded-2xl">
        <span className="text-xs uppercase tracking-widest">Knowledge Level:</span>
        <span className="text-slate-800">{progress.knowledgeLevel}</span>
      </div>

      <div className="block">
        <button
          onClick={onRestart}
          className="px-12 py-5 bg-indigo-600 text-white text-xl font-bold rounded-[1.5rem] shadow-2xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:translate-y-0"
        >
          Try New Topic
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;
