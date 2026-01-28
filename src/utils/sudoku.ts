// Sudoku Utility Functions

export type CellValue = number | null;
export type Board = CellValue[][];

export const BLANK: CellValue = null;

const shuffle = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const isValid = (board: Board, row: number, col: number, num: number): boolean => {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) return false;
  }

  // Check col
  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num) return false;
  }

  // Check 3x3 box
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i][startCol + j] === num) return false;
    }
  }

  return true;
};

const solveSudoku = (board: Board): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === BLANK) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) return true;
            board[row][col] = BLANK;
          }
        }
        return false;
      }
    }
  }
  return true;
};

const fillDiagonal = (board: Board) => {
  for (let i = 0; i < 9; i = i + 3) {
    fillBox(board, i, i);
  }
};

const fillBox = (board: Board, row: number, col: number) => {
  let num: number;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      do {
        num = Math.floor(Math.random() * 9) + 1;
      } while (!isSafeInBox(board, row, col, num));
      board[row + i][col + j] = num;
    }
  }
};

const isSafeInBox = (board: Board, rowStart: number, colStart: number, num: number) => {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[rowStart + i][colStart + j] === num) return false;
    }
  }
  return true;
};

export const generateSudoku = (difficulty: 'Easy' | 'Medium' | 'Hard' = 'Easy'): { initial: Board, solved: Board } => {
  const board: Board = Array.from({ length: 9 }, () => Array(9).fill(BLANK));

  // Step 1: Fill diagonal 3x3 matrices
  fillDiagonal(board);

  // Step 2: Fill remaining blocks
  solveSudoku(board);
  
  const solved = board.map(row => [...row]);

  // Step 3: Remove Randomly K digits to make game
  let attempts = difficulty === 'Easy' ? 30 : difficulty === 'Medium' ? 45 : 55;
  while (attempts > 0) {
    let row = Math.floor(Math.random() * 9);
    let col = Math.floor(Math.random() * 9);
    while (board[row][col] === BLANK) {
      row = Math.floor(Math.random() * 9);
      col = Math.floor(Math.random() * 9);
    }
    board[row][col] = BLANK;
    attempts--;
  }

  return { initial: board, solved };
};
