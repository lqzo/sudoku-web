import React, { useEffect } from 'react';
import { useGameStore, Difficulty } from '../store/gameStore';
import { RefreshCw, Settings } from 'lucide-react';

const Header: React.FC = () => {
  const { difficulty, mistakes, startGame, status } = useGameStore();
  const [timer, setTimer] = React.useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (status === 'playing') {
      interval = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  // Reset timer on new game (detect status change to 'playing' or difficulty change? 
  // Ideally store should handle timer or expose reset, but local state is fine for simple demo if we reset it manually)
  // Let's reset when difficulty changes or manual reset.
  // Actually, best to expose a "time" in store or just reset here when a "key" changes.

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleNewGame = () => {
    startGame(difficulty);
    setTimer(0);
  };

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    startGame(e.target.value as Difficulty);
    setTimer(0);
  };

  return (
    <div className="w-full max-w-md flex flex-col gap-4 mb-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Sudoku</h1>
        <div className="flex items-center gap-2">
            <select 
                value={difficulty} 
                onChange={handleDifficultyChange}
                className="bg-surface text-sm font-medium text-text border-none rounded-md py-1 px-2 focus:ring-2 focus:ring-primary outline-none cursor-pointer"
            >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
            </select>
            <button 
                onClick={handleNewGame}
                className="p-2 text-text/70 hover:text-primary hover:bg-surface rounded-full transition-colors"
                title="New Game"
            >
                <RefreshCw size={20} />
            </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm font-medium text-text/80 px-2">
        <div className="flex items-center gap-1">
            <span className="text-text/60">Mistakes:</span>
            <span className={mistakes > 0 ? "text-red-500" : ""}>{mistakes}/3</span>
        </div>
        <div className="flex items-center gap-1">
            <span className="text-text/60">Time:</span>
            <span>{formatTime(timer)}</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
