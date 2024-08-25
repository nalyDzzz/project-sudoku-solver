"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

const checkPuzzle = (res, puzzle) => {
  if (puzzle.match(/[^1-9.]/g)) {
    return res.json({ error: "Invalid characters in puzzle" });
  } else if (puzzle.length !== 81) {
    return res.json({ error: "Expected puzzle to be 81 characters long" });
  }
};

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const { puzzle, coordinate, value } = req.body;

    if (!puzzle || !coordinate || !value) {
      return res.json({ error: "Required field(s) missing" });
    }

    checkPuzzle(res, puzzle);

    let [row, col] = coordinate.split("");
    switch (row.toUpperCase()) {
      case "A":
        row = 1;
        break;
      case "B":
        row = 2;
        break;
      case "C":
        row = 3;
        break;
      case "D":
        row = 4;
        break;
      case "E":
        row = 5;
        break;
      case "F":
        row = 6;
        break;
      case "G":
        row = 7;
        break;
      case "H":
        row = 8;
        break;
      case "I":
        row = 9;
        break;
      default:
        console.log("Something wrong in the switch case");
        break;
    }
    col = parseInt(col);

    if (
      coordinate.length !== 2 ||
      /[^1-9]/.test(row.toString()) ||
      /[^1-9]/.test(col.toString())
    ) {
      return res.json({ error: "Invalid coordinate" });
    }

    if (/[^1-9]/.test(value.toString())) {
      return res.json({ error: "Invalid value" });
    }

    let conflict = [];

    if (!solver.checkRowPlacement(puzzle, row, col, value)) {
      conflict.push("row");
    }

    if (!solver.checkColPlacement(puzzle, row, col, value)) {
      conflict.push("column");
    }

    if (!solver.checkRegionPlacement(puzzle, row, col, value)) {
      conflict.push("region");
    }

    return res.json(
      conflict.length ? { valid: false, conflict: conflict } : { valid: true }
    );
  });

  app.route("/api/solve").post((req, res) => {
    const { puzzle } = req.body;

    if (!puzzle) {
      return res.json({ error: "Required field missing" });
    }

    checkPuzzle(res, puzzle);

    const solvedPuzzle = solver.solve(puzzle);

    return res.json(
      solvedPuzzle
        ? { solution: solvedPuzzle }
        : { error: "Puzzle cannot be solved" }
    );
  });
};
