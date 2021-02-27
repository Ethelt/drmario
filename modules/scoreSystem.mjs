"use strict";

import { Utilities } from "./utilities.mjs"

// This class handles reading, saving and showing score on a scoreboard, 
export class ScoreSystem {
    constructor(gameManager) {
        this.gameManager = gameManager
        this.score = 0
        this.scoreIncrement = 100 // How many points should player get when destroying a single virus
        this.scoreBoard = document.getElementById("scores")
        this.updateScoreBoard()
    }

    incrementScore() {
        this.score += this.scoreIncrement
        this.updateScoreBoard()
    }

    // Save the current score to the local storage
    saveScore() {
        if (this.score > this.getMaxScore()) {
            localStorage.setItem('score', this.score);
        }
    }

    // Read the max score from local storage
    getMaxScore() {
        var maxScore = localStorage.getItem('score');
        return maxScore ? maxScore : 0 // When the game is played for the first time, this would return null and crash, so we return 0 instead
    }

    updateScoreBoard() {
        // Update current score on the board
        var scoreImage = Utilities.convertNumericStringToImage(this.score.toString().padStart(7, "0"))
        scoreImage.style.top = "224px"
        scoreImage.style.right = "64px"
        this.scoreBoard.appendChild(scoreImage)

        // Update max score on the board
        var scoreImage = Utilities.convertNumericStringToImage(this.getMaxScore().toString().padStart(7, "0"))
        scoreImage.style.top = "128px"
        scoreImage.style.right = "64px"
        this.scoreBoard.appendChild(scoreImage)
    }

    resetScore() {
        this.score = 0
        this.updateScoreBoard()
    }
}