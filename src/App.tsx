import React, { useEffect } from 'react';
import SudokuGrid from './components/SudokuGrid';
import NumberPad from './components/NumberPad';
import GameControls from './components/GameControls';
import Header from './components/Header';
import { useGameStore } from './store/gameStore';

function App() {
  const { startGame, status } = useGameStore();

  useEffect(() => {
    startGame();
  }, []); // Run once on mount

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md flex flex-col items-center">
        <Header />
        
        <div className="relative w-full flex flex-col items-center">
          <SudokuGrid />
          
          {/* Game Over / Won Overlay */}
          {status !== 'playing' && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-lg">
              <div className="bg-white p-6 rounded-xl shadow-2xl text-center border-2 border-primary/20 animate-in fade-in zoom-in duration-300">
                <h2 className="text-3xl font-bold mb-2 text-text">
                  {status === 'won' ? 'Excellent!' : 'Game Over'}
                </h2>
                <p className="text-text/70 mb-6">
                  {status === 'won' ? 'You solved the puzzle.' : 'Too many mistakes.'}
                </p>
                <button
                  onClick={() => startGame()}
                  className="px-6 py-3 bg-primary text-white rounded-full font-semibold shadow-lg hover:bg-primary/90 hover:scale-105 transition-all"
                >
                  New Game
                </button>
              </div>
            </div>
          )}
        </div>

        <GameControls />
        <NumberPad />
      </div>
    </div>
  );
}

export default App;
