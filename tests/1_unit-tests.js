const chai = require('chai');
const assert = chai.assert;
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();



const validPuzzleString = puzzlesAndSolutions[0][0];
const validPuzzleStringSolution = puzzlesAndSolutions[0][1];

suite('Unit Tests', () => {
    test("Logic handles a valid puzzle string of 81 characters", (done) => {
        assert.isTrue(solver.validate(validPuzzleString));
        done();
    });
    test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", (done) => {
        assert.isFalse(solver.validate(validPuzzleString.replace('1', 'g')));
        done();
    });
    test("Logic handles a puzzle string that is not 81 characters in length", (done) => {
        assert.isFalse(solver.validate(validPuzzleString.replace('.', '')));
        done();
    });
    test("Logic handles a valid row placement", (done) => {
        assert.isTrue(solver.checkRowPlacement(validPuzzleString, 1, 1, 1));
        done();
    });
    test("Logic handles an invalid row placement", (done) => {
        assert.isFalse(solver.checkRowPlacement(validPuzzleString, 1, 1, 2));
        done();
        
    });
    test("Logic handles a valid column placement", (done) => {
        assert.isTrue(solver.checkColPlacement(validPuzzleString, 1, 1, 1));
        done();

    });
    test("Logic handles an invalid column placement", (done) => {
        assert.isFalse(solver.checkColPlacement(validPuzzleString, 1, 1, 2));
        done();
    });
    test("Logic handles a valid region (3x3 grid) placement", (done) => {
        assert.isTrue(solver.checkRegionPlacement(validPuzzleString, 1, 1, 1));
        done();
    });
    test("Logic handles an invalid region (3x3 grid) placement", (done) => {
        assert.isFalse(solver.checkColPlacement(validPuzzleString, 1, 1, 2));
        done();
    });
    test("Valid puzzle strings pass the solver", (done) => {
        assert.isTrue(solver.validate(validPuzzleString));
        done();
    });
    test("Invalid puzzle strings fail the solver", (done) => {
        assert.isFalse(solver.validate(validPuzzleString.replace('.', 'x')));
        done();
    });
    test("Solver returns the expected solution for an incomplete puzzle", (done) => {
        assert.equal(solver.solve(validPuzzleString), validPuzzleStringSolution);
        done();
    });

});
