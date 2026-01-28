import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Eraser, Pencil, RotateCcw, Lightbulb } from 'lucide-react';
import { clsx } from 'clsx';

const GameControls: React.FC = () => {
  const { isNoteMode, toggleNoteMode, eraseCell } = useGameStore();

  const controls = [
    // { icon: RotateCcw, label: 'Undo', action: () => console.log('Undo'), active: false }, // Placeholder
    { icon: Eraser, label: 'Erase', action: eraseCell, active: false },
    { icon: Pencil, label: 'Notes', action: toggleNoteMode, active: isNoteMode },
    // { icon: Lightbulb, label: 'Hint', action: () => console.log('Hint'), active: false }, // Placeholder
  ];

  return (
    <div className="flex justify-around w-full max-w-md mt-4 mb-2">
      {controls.map((control, index) => (
        <div key={index} className="flex flex-col items-center gap-1">
          <button
            onClick={control.action}
            className={clsx(
              "p-4 rounded-full transition-all duration-200 active:scale-95 shadow-sm",
              control.active 
                ? "bg-primary text-white shadow-md ring-2 ring-primary ring-offset-2" 
                : "bg-surface text-text/70 hover:bg-gray-100 hover:text-primary"
            )}
          >
            <control.icon size={24} strokeWidth={2.5} />
          </button>
          <span className="text-xs font-medium text-text/70">{control.label}</span>
        </div>
      ))}
    </div>
  );
};

export default GameControls;
