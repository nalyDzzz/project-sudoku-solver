class SudokuSolver {
  validate(puzzleString) {
    // Validates the submitted puzzleString and makes sure it has exactly 81 characters of only 1-9 or .'s
    if (puzzleString.length !== 81) return false;
    if (puzzleString.match(/[^1-9.]/g)) return false;

    for (let i = 0; i < puzzleString.length; i++) {
      const row = Math.floor(i / 9) + 1;
      const col = (i % 9) + 1;
      const value = puzzleString[i];

      if (value === ".") continue;

      if (
        !this.checkColPlacement(puzzleString, row, col, value) ||
        !this.checkRowPlacement(puzzleString, row, col, value) ||
        this.checkRegionPlacement(puzzleString, row, col, value)
      ) {
        return false;
      }
    }
    return true;
  }
  checkRowPlacement(puzzleString, row, column, value) {
    // Checks the current state of the full 9 rows after validation of puzzle string
    const rowStart = (row - 1) * 9;
    let rowValues = puzzleString.slice(rowStart, rowStart + 9);
    rowValues = rowValues.slice(0, column - 1) + rowValues.slice(column);

    return !rowValues.includes(value);
  }

  checkColPlacement(puzzleString, row, column, value) {
    // Checks the current state of the full 9 columns after validation of puzzle string
    const colStart = column - 1;
    let colValues = [];

    for (let i = colStart; i < puzzleString.length; i += 9) {
      colValues.push(puzzleString[i]);
    }
    colValues = colValues.slice(0, row - 1) + colValues.slice(row);

    return !colValues.includes(value);
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    // Calculate the starting index of the 3x3 region
    const regionRowStart = Math.floor((row - 1) / 3) * 3;
    const regionColStart = Math.floor((column - 1) / 3) * 3;
    const index = (row - 1) * 9 + (column - 1);

    // Check if the value at the index matches the value being checked
    if (puzzleString[index] === value) {
      return true;
    };

    let regionValues = [];

    // Loop through the 3x3 region to collect values
    for (let r = regionRowStart; r < regionRowStart + 3; r++) {
      for (let c = regionColStart; c < regionColStart + 3; c++) {
        regionValues.push(puzzleString[r * 9 + c]);
      }
    }

    // Check if the value is already in the region
    return !regionValues.includes(value);
  }

  solve(puzzleString) {
    // Helper function to find the first empty cell
    const findEmptyCell = (puzzle) => {
      for (let i = 0; i < puzzle.length; i++) {
        if (puzzle[i] === ".") {
          return i;
        }
      }
      return -1;
    };

    // Find the first empty cell
    const emptyCellIndex = findEmptyCell(puzzleString);
    if (emptyCellIndex === -1) {
      return puzzleString;
    }

    const row = Math.floor(emptyCellIndex / 9) + 1;
    const column = (emptyCellIndex % 9) + 1;

    // Try all possible numbers from 1 to 9
    for (let num = 1; num <= 9; num++) {
      const value = num.toString();

      if (
        this.checkRowPlacement(puzzleString, row, column, value) &&
        this.checkColPlacement(puzzleString, row, column, value) &&
        this.checkRegionPlacement(puzzleString, row, column, value)
      ) {
        // Place the number and recursively solve
        const newPuzzleString =
          puzzleString.slice(0, emptyCellIndex) +
          value +
          puzzleString.slice(emptyCellIndex + 1);
        const solvedPuzzle = this.solve(newPuzzleString);

        if (solvedPuzzle) {
          return solvedPuzzle;
        }
      }
    }

    // No valid number found, backtrack
    return false;
  }
}

module.exports = SudokuSolver;
