import React, { useState } from 'react';
import { QuizStatus, QuizProgress, ParsedResponse, KnowledgeLevel } from './types';
import { quizService } from './services/geminiService';
import SetupScreen from './components/SetupScreen';
import QuizGame from './components/QuizGame';
import ResultScreen from './components/ResultScreen';

const App: React.FC = () => {
  const [status, setStatus] = useState<QuizStatus>(QuizStatus.SETUP);
  const [isLoading, setIsLoading] = useState(false);
  const [currentData, setCurrentData] = useState<ParsedResponse | null>(null);
  const [progress, setProgress] = useState<QuizProgress>({
    score: 0,
    incorrect: 0,
    totalQuestions: 0,
    difficulty: 3, // Start at a baseline difficulty
    currentStreak: 0,
    knowledgeLevel: 'Beginner'
  });

  const handleStartQuiz = async (topic: string, level: KnowledgeLevel) => {
    setIsLoading(true);
    setStatus(QuizStatus.LOADING);
    
    // Initial difficulty based on knowledge level
    const initialDifficulty = level === 'Beginner' ? 2 : level === 'Intermediate' ? 5 : 8;

    try {
      const firstData = await quizService.startQuiz(topic, level, initialDifficulty);
      setCurrentData(firstData);
      setStatus(QuizStatus.PLAYING);
      setProgress({
        score: 0,
        incorrect: 0,
        totalQuestions: 0,
        difficulty: initialDifficulty,
        currentStreak: 0,
        knowledgeLevel: level
      });
    } catch (error) {
      console.error("Failed to start quiz:", error);
      alert("Teca is having some connectivity issues. Please refresh and try again!");
      setStatus(QuizStatus.SETUP);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelected = (isCorrect: boolean) => {
    setProgress(prev => {
      // Dynamic difficulty logic:
      // +1 difficulty for every 2 correct answers in a row
      // -1 difficulty for any wrong answer
      let newDifficulty = prev.difficulty;
      if (isCorrect && (prev.currentStreak + 1) % 2 === 0) {
        newDifficulty = Math.min(prev.difficulty + 1, 10);
      } else if (!isCorrect) {
        newDifficulty = Math.max(prev.difficulty - 1, 1);
      }

      return {
        ...prev,
        score: isCorrect ? prev.score + 1 : prev.score,
        incorrect: isCorrect ? prev.incorrect : prev.incorrect + 1,
        totalQuestions: prev.totalQuestions + 1,
        currentStreak: isCorrect ? prev.currentStreak + 1 : 0,
        difficulty: newDifficulty
      };
    });
  };

  const handleNextQuestion = async () => {
    if (progress.totalQuestions >= 10) {
      setStatus(QuizStatus.FINISHED);
      return;
    }

    setIsLoading(true);
    try {
      // Pass the updated difficulty to the service
      const nextData = await quizService.nextQuestion(progress.difficulty);
      setCurrentData(nextData);
    } catch (error) {
      console.error("Failed to fetch next question:", error);
      alert("Lost connection to the tutor. Trying again...");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = () => {
    setStatus(QuizStatus.SETUP);
    setCurrentData(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-indigo-100 selection:text-indigo-700">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-emerald-600 rounded-full blur-[120px]"></div>
      </div>

      <header className="relative z-10 w-full px-8 py-8 flex justify-between items-center max-w-7xl mx-auto">
        <div 
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={handleRestart}
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-lg shadow-indigo-100 group-hover:rotate-12 transition-transform">T</div>
          <span className="font-outfit font-black text-slate-800 text-2xl tracking-tight">Teca</span>
        </div>
        
        {status === QuizStatus.PLAYING && (
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-100">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Difficulty</span>
              <span className="font-black text-amber-600">{progress.difficulty}/10</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-100">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Score</span>
              <span className="font-black text-indigo-600">{progress.score}</span>
            </div>
          </div>
        )}
      </header>

      <main className="relative z-10 flex-grow flex flex-col items-center justify-center">
        {status === QuizStatus.SETUP && (
          <SetupScreen onStart={handleStartQuiz} isLoading={isLoading} />
        )}

        {status === QuizStatus.LOADING && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-16 h-16 mb-8">
              <div className="absolute inset-0 border-[6px] border-indigo-50 rounded-full"></div>
              <div className="absolute inset-0 border-[6px] border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Teca is thinking...</h3>
            <p className="text-slate-400 font-medium">Calibrating difficulty for your learning path.</p>
          </div>
        )}

        {status === QuizStatus.PLAYING && currentData && (
          <QuizGame 
            currentData={currentData}
            progress={progress}
            onAnswerSelected={handleAnswerSelected}
            onNextQuestion={handleNextQuestion}
            isLoading={isLoading}
            onExit={handleRestart}
          />
        )}

        {status === QuizStatus.FINISHED && (
          <ResultScreen progress={progress} onRestart={handleRestart} />
        )}
      </main>

      <footer className="relative z-10 py-10 text-center">
        <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.2em]">&copy; 2025 Teca MCQ • Adaptive AI Tutor</p>
      </footer>
    </div>
  );
};

export default App;