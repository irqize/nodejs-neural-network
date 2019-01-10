"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Matrix {
    constructor(rows, columns) {
        this.rows = rows;
        this.columns = columns;
        this.data = new Array(this.rows).fill([]).map(() => Array(this.columns).fill(0));
    }
    static map(matrix, f) {
        let m = new Matrix(matrix.rows, matrix.columns);
        m.map((v, i, j) => f(matrix.data[i][j], i, j));
        return m;
    }
    map(f) {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                this.data[i][j] = f(this.data[i][j], i, j);
            }
        }
    }
    randomize() {
        this.map(() => Math.random() * 2 - 1);
    }
    add(n) {
        if (n instanceof Matrix) {
            if (this.rows !== n.rows || this.columns !== n.columns) {
                throw new Error('Size of both matrices must match!');
            }
            return this.map((v, i, j) => v + n.data[i][j]);
        }
        else {
            return this.map(v => v + n);
        }
    }
    static subtract(a, b) {
        if (a.rows !== b.rows || a.columns !== b.columns) {
            throw new Error('Size of both matrices must match!');
        }
        let m = new Matrix(a.rows, a.columns);
        m.map((_, i, j) => a.data[i][j] - b.data[i][j]);
        return m;
    }
    subtract(a) {
        if (a.rows !== this.rows || a.columns !== this.columns) {
            throw new Error('Size of both matrices must match!');
        }
        this.map((_, i, j) => this.data[i][j] - a.data[i][j]);
    }
    static multiply(a, b) {
        if (a.columns !== b.rows) {
            throw new Error('a.columns !== b.rows');
        }
        let m = new Matrix(a.rows, b.columns);
        m.map((_, i, j) => {
            let sum = 0;
            for (let k = 0; k < a.columns; k++) {
                sum += a.data[i][k] * b.data[k][j];
            }
            return sum;
        });
        return m;
    }
    multiply(n) {
        if (n instanceof Matrix) {
            if (this.rows !== n.rows || this.columns !== n.columns) {
                throw new Error('Size of both matrices must match!');
            }
            return this.map((v, i, j) => v * n.data[i][j]);
        }
        else {
            return this.map(v => v * n);
        }
    }
    toArray() {
        let arr = [];
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                arr.push(this.data[i][j]);
            }
        }
        return arr;
    }
    static transpose(matrix) {
        let m = new Matrix(matrix.columns, matrix.rows);
        m.map((_, i, j) => matrix.data[j][i]);
        return m;
    }
    static createFromArray(arr) {
        let m = new Matrix(arr.length, 1);
        m.map((v, i) => arr[i]);
        return m;
    }
}
exports.default = Matrix;
//# sourceMappingURL=matrix.js.map