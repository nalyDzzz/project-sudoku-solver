const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');
const validPuzzleString = puzzlesAndSolutions[0][0];
const validPuzzleStringSolution = puzzlesAndSolutions[0][1];
chai.use(chaiHttp);


suite("Functional Tests", () => {
  test("Solve a puzzle with valid puzzle string: POST request to /api/solve", (done) => {
    chai
        .request(server)
        .post('/api/solve')
        .send({ puzzle: validPuzzleString})
        .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.solution, validPuzzleStringSolution);
            done();
        })
  });
  test("Solve a puzzle with missing puzzle string: POST request to /api/solve", (done) => {
    chai
        .request(server)
        .post('/api/solve')
        .send()
        .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, "error");
            done();
        })
  });
  test("Solve a puzzle with invalid characters: POST request to /api/solve", (done) => {
    chai
        .request(server)
        .post('/api/solve')
        .send({ puzzle: validPuzzleString.replace('.', 'g') })
        .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "Invalid characters in puzzle");
            done();
        })
  });
  test("Solve a puzzle with incorrect length: POST request to /api/solve", (done) => {
    
    chai
        .request(server)
        .post('/api/solve')
        .send({ puzzle: validPuzzleString.slice(0, 80) })
        .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
            done()
        })
  });
  test("Solve a puzzle that cannot be solved: POST request to /api/solve", (done) => {
    chai
        .request(server)
        .post('/api/solve')
        .send({ puzzle: validPuzzleString.replace('.', '1')})
        .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "Puzzle cannot be solved");
            done();
        })
  });
  test("Check a puzzle placement with all fields: POST request to /api/check", (done) => {
    chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: validPuzzleString, coordinate: 'A2', value: '3'})
        .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isTrue(res.body.valid);
            done()
        })
  });
  test("Check a puzzle placement with single placement conflict: POST request to /api/check", (done) => {
    chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: validPuzzleString, coordinate: 'A2', value: '7'})
        .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isFalse(res.body.valid);
            assert.isArray(res.body.conflict);
            assert.include(res.body.conflict, 'column');
            done();
        })
  });
  test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", (done) => {
    chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: validPuzzleString, coordinate: 'A2', value: '5'})
        .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isFalse(res.body.valid);
            assert.isArray(res.body.conflict);
            assert.include(res.body.conflict, 'row');
            assert.include(res.body.conflict, 'region');
            done()
        })
  });
  test("Check a puzzle placement with all placement conflicts: POST request to /api/check", (done) => {
    chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: validPuzzleString, coordinate: 'A2', value: '2'})
        .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isFalse(res.body.valid);
            assert.isArray(res.body.conflict);
            assert.include(res.body.conflict, 'row');
            assert.include(res.body.conflict, 'region');
            assert.include(res.body.conflict, "column");
            done()
        })
  });
  test("Check a puzzle placement with missing required fields: POST request to /api/check", (done) => {
    chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: validPuzzleString, value: '2'})
        .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "Required field(s) missing");
            done()
        })
  });
  test("Check a puzzle placement with invalid characters: POST request to /api/check", (done) => {
    chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: validPuzzleString, coordinate: 'Z5', value: '2'})
        .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "Invalid coordinate");
            done()
        })
  });
  test("Check a puzzle placement with incorrect length: POST request to /api/check", (done) => {
    chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: validPuzzleString.slice(0, 80), coordinate: 'A2', value: '5'})
        .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
            done();
        })
  });
  test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", (done) => {
    chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: validPuzzleString, coordinate: 'Z5', value: '2'})
        .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "Invalid coordinate");
            done();
        })
  });
  test("Check a puzzle placement with invalid placement value: POST request to /api/check", (done) => {
    chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: validPuzzleString, coordinate: 'A2', value: 'G'})
        .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "Invalid value");
            done();
        })
  });
});

