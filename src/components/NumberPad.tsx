import React from 'react';
import { useGameStore } from '../store/gameStore';
import { clsx } from 'clsx';

const NumberPad: React.FC = () => {
  const { setCellValue } = useGameStore();
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="grid grid-cols-9 gap-1 sm:gap-2 w-full max-w-md mt-6">
      {numbers.map((num) => (
        <button
          key={num}
          onClick={() => setCellValue(num)}
          className={clsx(
            "aspect-[3/4] sm:aspect-square flex items-center justify-center text-xl sm:text-2xl font-medium rounded-lg transition-all active:scale-95",
            "bg-surface text-primary shadow-sm border border-primary/20",
            "hover:bg-primary hover:text-white hover:border-primary",
            "focus:outline-none focus:ring-2 focus:ring-primary/50"
          )}
        >
          {num}
        </button>
      ))}
    </div>
  );
};

export default NumberPad;
