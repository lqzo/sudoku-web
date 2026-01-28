import { create } from 'zustand';
import { generateSudoku, Board, CellValue } from '../utils/sudoku';

export type Cell = {
  value: CellValue;
  isFixed: boolean;
  notes: number[];
  isError: boolean;
  row: number;
  col: number;
};

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

interface GameState {
  grid: Cell[][];
  solvedGrid: Board;
  selectedCell: [number, number] | null;
  difficulty: Difficulty;
  mistakes: number;
  status: 'playing' | 'won' | 'lost';
  isNoteMode: boolean;
  
  // Actions
  startGame: (difficulty?: Difficulty) => void;
  selectCell: (row: number, col: number) => void;
  setCellValue: (value: number) => void;
  toggleNoteMode: () => void;
  eraseCell: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  grid: [],
  solvedGrid: [],
  selectedCell: null,
  difficulty: 'Easy',
  mistakes: 0,
  status: 'playing',
  isNoteMode: false,

  startGame: (difficulty = 'Easy') => {
    const { initial, solved } = generateSudoku(difficulty);
    const grid: Cell[][] = initial.map((row, r) =>
      row.map((val, c) => ({
        value: val,
        isFixed: val !== null,
        notes: [],
        isError: false,
        row: r,
        col: c,
      }))
    );

    set({
      grid,
      solvedGrid: solved,
      difficulty,
      mistakes: 0,
      status: 'playing',
      selectedCell: null,
    });
  },

  selectCell: (row, col) => {
    set({ selectedCell: [row, col] });
  },

  setCellValue: (value) => {
    const { grid, selectedCell, solvedGrid, isNoteMode, mistakes } = get();
    if (!selectedCell || get().status !== 'playing') return;

    const [row, col] = selectedCell;
    const cell = grid[row][col];

    if (cell.isFixed) return;

    const newGrid = [...grid.map(r => [...r])];
    const currentCell = { ...newGrid[row][col] };

    if (isNoteMode) {
      // Toggle note
      const notes = currentCell.notes.includes(value)
        ? currentCell.notes.filter(n => n !== value)
        : [...currentCell.notes, value];
      currentCell.notes = notes;
      newGrid[row][col] = currentCell;
      set({ grid: newGrid });
    } else {
      // Set value
      if (currentCell.value === value) return; // No change

      const correctValue = solvedGrid[row][col];
      const isCorrect = value === correctValue;

      currentCell.value = value;
      currentCell.isError = !isCorrect;
      currentCell.notes = []; // Clear notes on set

      newGrid[row][col] = currentCell;

      let newMistakes = mistakes;
      let newStatus = get().status;

      if (!isCorrect) {
        newMistakes += 1;
        if (newMistakes >= 3) {
            newStatus = 'lost'; 
        }
      } else {
        // Check win condition
        let isWon = true;
        for(let r=0; r<9; r++) {
            for(let c=0; c<9; c++) {
                if (newGrid[r][c].value !== solvedGrid[r][c]) {
                    isWon = false;
                    break;
                }
            }
        }
        if (isWon) newStatus = 'won';
      }

      set({ grid: newGrid, mistakes: newMistakes, status: newStatus });
    }
  },

  toggleNoteMode: () => set(state => ({ isNoteMode: !state.isNoteMode })),

  eraseCell: () => {
    const { grid, selectedCell } = get();
    if (!selectedCell || get().status !== 'playing') return;

    const [row, col] = selectedCell;
    const cell = grid[row][col];

    if (cell.isFixed) return;

    const newGrid = [...grid.map(r => [...r])];
    newGrid[row][col] = { ...cell, value: null, isError: false, notes: [] };
    set({ grid: newGrid });
  }
}));
