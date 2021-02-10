"use strict";

export class ScoreSystem {
    constructor(gameManager) {
        this.gameManager = gameManager
        this.score = 0
        this.scoreIncrement = 100
    }

    incrementScore() {
        this.score += this.scoreIncrement
    }

    saveScore() {
        localStorage.setItem('score', this.score);
        console.log(this.score)
    }

    getMaxScore() {
        return localStorage.getItem('score');
    }
}