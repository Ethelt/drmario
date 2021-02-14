"use strict";

import { Utilities } from "./utilities.mjs"

export class ScoreSystem {
    constructor(gameManager) {
        this.gameManager = gameManager
        this.score = 0
        this.scoreIncrement = 100
        this.scoreBoard = document.getElementById("scores")
        this.updateScoreBoard()
    }

    incrementScore() {
        this.score += this.scoreIncrement
        this.updateScoreBoard()
    }

    saveScore() {
        if (this.score > this.getMaxScore()) {
            localStorage.setItem('score', this.score);
        }
    }

    getMaxScore() {
        var maxScore = localStorage.getItem('score');
        return maxScore ? maxScore : 0
    }

    updateScoreBoard() {
        var scoreImage = Utilities.convertStringToImage(this.score.toString().padStart(7, "0"))
        scoreImage.style.top = "224px"
        scoreImage.style.right = "64px"
        this.scoreBoard.appendChild(scoreImage)

        var scoreImage = Utilities.convertStringToImage(this.getMaxScore().toString().padStart(7, "0"))
        scoreImage.style.top = "128px"
        scoreImage.style.right = "64px"
        this.scoreBoard.appendChild(scoreImage)
    }

    resetScore() {
        this.score = 0
        this.updateScoreBoard()
    }
}