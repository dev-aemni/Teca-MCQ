
import React, { useState, useEffect } from 'react';
import { ParsedResponse, QuizProgress } from '../types';

interface QuizGameProps {
  currentData: ParsedResponse;
  progress: QuizProgress;
  onAnswerSelected: (isCorrect: boolean) => void;
  onNextQuestion: () => void;
  isLoading: boolean;
  onExit: () => void;
}

const QuizGame: React.FC<QuizGameProps> = ({ 
  currentData, 
  progress, 
  onAnswerSelected, 
  onNextQuestion,
  isLoading,
  onExit
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    setSelectedId(null);
    setShowFeedback(false);
  }, [currentData.question]);

  const handleOptionClick = (id: 'A' | 'B' | 'C' | 'D') => {
    if (isLoading || showFeedback) return;
    
    setSelectedId(id);
    setShowFeedback(true);
    
    const isCorrect = id === currentData.correctId;
    onAnswerSelected(isCorrect);
  };

  const progressPercent = Math.min((progress.totalQuestions / 10) * 100, 100);

  return (
    <div className="max-w-3xl mx-auto w-full px-4 py-8 animate-in fade-in duration-700">
      {/* HUD */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-tighter rounded-md mb-1">
            {progress.knowledgeLevel} Mode
          </span>
          <h2 className="text-2xl font-outfit font-bold text-slate-800">Q{progress.totalQuestions + 1} of 10</h2>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-400 uppercase font-black">Accuracy</p>
          <p className="text-2xl font-black text-slate-800">
            {progress.totalQuestions === 0 ? '100%' : `${Math.round((progress.score / progress.totalQuestions) * 100)}%`}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-1.5 rounded-full mb-10 overflow-hidden">
        <div 
          className="bg-indigo-600 h-full transition-all duration-700 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/40 p-8 md:p-12 mb-8 border border-slate-100 relative overflow-hidden">
        <p className="text-xl md:text-2xl text-slate-800 font-semibold leading-relaxed mb-10">
          {currentData.question}
        </p>

        <div className="grid grid-cols-1 gap-4">
          {currentData.options.map((option) => {
            const isSelected = selectedId === option.id;
            const isCorrect = option.id === currentData.correctId;
            const isWrong = isSelected && !isCorrect;
            
            let btnClass = "border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30";
            let iconClass = "bg-slate-100 text-slate-400";

            if (showFeedback) {
              if (isCorrect) {
                btnClass = "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100 shadow-lg shadow-emerald-50 scale-[1.02]";
                iconClass = "bg-emerald-500 text-white";
              } else if (isWrong) {
                btnClass = "border-rose-500 bg-rose-50 ring-2 ring-rose-100 opacity-90";
                iconClass = "bg-rose-500 text-white";
              } else {
                btnClass = "border-slate-50 bg-slate-50 opacity-50 grayscale-[0.5]";
                iconClass = "bg-slate-200 text-slate-400";
              }
            }

            return (
              <button
                key={option.id}
                disabled={showFeedback || isLoading}
                onClick={() => handleOptionClick(option.id)}
                className={`
                  group relative flex items-center p-5 rounded-2xl border-2 transition-all duration-300 text-left
                  ${btnClass}
                  ${!showFeedback && !isLoading ? 'cursor-pointer active:scale-95' : 'cursor-default'}
                `}
              >
                <div className={`
                  flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-black mr-4 transition-all
                  ${iconClass}
                `}>
                  {showFeedback && isCorrect ? '✓' : showFeedback && isWrong ? '✗' : option.id}
                </div>
                <span className={`text-base font-bold ${showFeedback && isCorrect ? 'text-emerald-900' : showFeedback && isWrong ? 'text-rose-900' : 'text-slate-600'}`}>
                  {option.text}
                </span>
              </button>
            );
          })}
        </div>

        {/* Explanation Block */}
        {showFeedback && (
          <div className="mt-10 p-6 bg-slate-50 rounded-2xl border border-slate-100 animate-in slide-in-from-top-4 duration-500">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg">💡</span>
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Explanation</span>
            </div>
            <p className="text-slate-600 leading-relaxed font-medium">
              {currentData.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex justify-between items-center min-h-[60px]">
        <button 
          onClick={onExit}
          className="text-slate-400 hover:text-rose-500 font-bold text-sm transition-colors"
        >
          Quit Session
        </button>
        
        {showFeedback && (
          <button
            onClick={onNextQuestion}
            disabled={isLoading}
            className="flex items-center space-x-2 px-8 py-4 bg-indigo-600 text-white font-black rounded-xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:translate-y-0 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="animate-pulse">Loading Next...</span>
            ) : (
              <>
                <span>Next Question</span>
                <span className="text-lg">→</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizGame;
