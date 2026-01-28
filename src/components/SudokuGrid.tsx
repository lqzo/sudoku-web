import React from 'react';
import { useGameStore } from '../store/gameStore';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const SudokuGrid: React.FC = () => {
  const { grid, selectedCell, selectCell, mistakes } = useGameStore();

  if (!grid.length) return null;

  return (
    <div className="w-full max-w-md aspect-square bg-text p-1 rounded-lg shadow-xl">
      <div className="grid grid-cols-9 grid-rows-9 h-full w-full bg-background gap-[1px] border-2 border-text rounded overflow-hidden">
        {grid.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {row.map((cell, colIndex) => {
              const isSelected = selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex;
              const isRightBorder = (colIndex + 1) % 3 === 0 && colIndex !== 8;
              const isBottomBorder = (rowIndex + 1) % 3 === 0 && rowIndex !== 8;
              
              // Check if cell is related (same row, col, or box) - Optional for better UX
              const isRelated = selectedCell && (
                selectedCell[0] === rowIndex || 
                selectedCell[1] === colIndex || 
                (Math.floor(selectedCell[0] / 3) === Math.floor(rowIndex / 3) && 
                 Math.floor(selectedCell[1] / 3) === Math.floor(colIndex / 3))
              );

              const isSameValue = selectedCell && 
                grid[selectedCell[0]][selectedCell[1]].value !== null &&
                grid[selectedCell[0]][selectedCell[1]].value === cell.value;

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => selectCell(rowIndex, colIndex)}
                  className={twMerge(
                    "relative flex items-center justify-center text-xl sm:text-2xl cursor-pointer transition-colors duration-100 select-none",
                    "bg-surface hover:bg-primary/10",
                    // Thick borders for 3x3 grid
                    isRightBorder && "border-r-2 border-r-text/30",
                    isBottomBorder && "border-b-2 border-b-text/30",
                    
                    // Highlighting
                    isRelated && !isSelected && "bg-primary/5",
                    isSameValue && !isSelected && "bg-primary/20",
                    isSelected && "bg-primary text-white",
                    
                    // Error state
                    cell.isError && "bg-red-100 text-red-600",
                    cell.isError && isSelected && "bg-red-500 text-white",

                    // Fixed numbers
                    cell.isFixed && !isSelected && "font-bold text-text",
                    cell.isFixed && isSelected && "text-white",
                    !cell.isFixed && !isSelected && "text-primary font-medium"
                  )}
                >
                  {cell.value ? (
                    <span>{cell.value}</span>
                  ) : (
                    // Notes grid
                    cell.notes.length > 0 && (
                      <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-[1px]">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                          <div key={n} className={twMerge(
                            "flex items-center justify-center text-[9px] sm:text-[11px] leading-none font-bold transition-colors",
                            isSelected ? "text-white/90" : "text-text/70"
                          )}>
                            {cell.notes.includes(n) ? n : ''}
                          </div>
                        ))}
                      </div>
                    )
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default SudokuGrid;
