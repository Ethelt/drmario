"use strict";

import { Board } from "./board.mjs"
import { InputManager } from "./inputManager.mjs"
import { VirusManager } from "./virusManager.mjs";
import { ScoreSystem } from "./scoreSystem.mjs";
import { InfoManager } from "./infoManager.mjs";

export class GameManager {

    constructor() {
        this.board;
        this.activePill;
        this.isLevelBeaten = false;
        this.isFirstPill = true
        this.input = new InputManager(this);
        this.level = 1;
        this.colors = ["blue", "brown", "yellow"]
        this.virusManager = new VirusManager(this)
        this.scoreSystem = new ScoreSystem(this)
        this.scheduledDrop;
    }

    startGame(spawn = true) {
        this.isLosing = false
        this.scheduledDrop = null
        this.isLevelBeaten = false;
        this.board = new Board(8, 17);
        this.virusManager.spawnViruses(this.level)
        InfoManager.updateLevel(this.level)
        if (spawn) {
            this.spawnPill()
        }
        this.setBackgroundColors(this.getBackgroundColor())
        this.board.render()
    }

    spawnPill() {
        if (!this.isLosing) {
            this.activePill = null
            this.board.render()
            var color = `${this.colors[Math.floor(Math.random() * this.colors.length)]}|${this.colors[Math.floor(Math.random() * this.colors.length)]}`
            // var color = "brown|blue"
            var spawn = this.board.spawnPill(color)
            var spawnedPill = spawn.pill
            if (spawn.isLosing) {
                this.isLosing = true
                setTimeout(() => this.finishGame(), 300)
            } else {
                this.scheduledDrop = setTimeout(() => {
                    this.activePill = spawnedPill
                    this.input.inputBusy = false
                    this.dropActivePill()
                }, 600)
            }
        }
    }

    dropActivePill(rushed = false) {
        this.isFirstPill = false
        var pillLanded = false
        if (this.activePill) {
            var pillLanded = !this.board.movePill(this.activePill, [1, 0])
        }
        if (pillLanded) {
            var objectsToRemove = this.getObjectsToRemove(this.activePill)
            objectsToRemove.forEach(object => {
                this.board.clearObject(object)
            })
            setTimeout(() => {
                if (objectsToRemove.size > 0) {
                    this.activePill = null
                    this.doGravity(new Set())
                    return 1
                } else {
                    this.spawnPill()
                }
            }, objectsToRemove.size > 0 ? 300 : 1)
        } else {
            this.scheduledDrop = setTimeout(() => this.dropActivePill(rushed), rushed ? 50 : 600)
        }
        this.board.render()
    }

    moveActivePill(direction) {
        this.board.movePill(this.activePill, direction)
        this.board.render()
    }

    rotateActivePill(direction) {
        if (direction == "left") {
            this.board.rotatePillLeft(this.activePill)
        } else {
            this.board.rotatePillRight(this.activePill)
        }
        this.board.render()
    }

    getObjectsToRemove(pill) {
        var objectsToRemove = new Set()
        pill.parts.forEach(part => {
            objectsToRemove = new Set([...objectsToRemove, ...this.board.getObjectsToRemove(part.position)])
        });
        return objectsToRemove
    }

    doGravity(objectsToRemove) {
        this.input.inputBusy = true
        this.board.render()
        var result = this.board.doGravityStep()
        var areMovesPossible = result.areMovesPossible
        var wereObjectsCleared = false

        setTimeout(() => {
            var objectsToRemove = new Set()
            result.stablePills.forEach(pill => {
                objectsToRemove = new Set([...objectsToRemove, ...this.getObjectsToRemove(pill)])
            })
            objectsToRemove.forEach(object => {
                this.board.clearObject(object)
                wereObjectsCleared = true
            })
            if (areMovesPossible) {
                this.scheduledDrop = setTimeout(() => this.doGravity(objectsToRemove), 200)
            } else {
                if (wereObjectsCleared) {
                    this.scheduledDrop = setTimeout(() => this.doGravity(objectsToRemove), 200)
                } else {
                    console.log("GO")
                    setTimeout(() => {
                        this.board.render()
                        this.finishLevelIfBeaten()
                        if (!this.isLevelBeaten) {
                            this.input.inputBusy = true
                            this.spawnPill()
                        }
                    }, wereObjectsCleared ? 200 : 10)
                }
            }
        }, objectsToRemove.length > 0 ? 300 : 1)
    }

    finishLevelIfBeaten() {
        if (this.isLevelBeaten) {
            this.board.render()
            var victoryScreen = document.createElement("div")
            victoryScreen.tabIndex = "-1"
            victoryScreen.classList.add("victory_screen")
            victoryScreen.style.backgroundColor = this.getBackgroundColor()
            victoryScreen.onkeyup = () => {
                victoryScreen.remove()
                this.startNextLevel()
            }
            document.getElementById("game-area").appendChild(victoryScreen)
            victoryScreen.focus()
        }
    }

    startNextLevel() {
        this.level += 1
        this.inputBusy = false
        this.isFirstPill = true
        this.startGame(true)
    }

    finishGame() {
        console.log("finish")
        // if (document.getElementsByClassName("failure_screen") == []) {
        this.board.render()
        this.scoreSystem.saveScore()
        var failureScreen = document.createElement("div")
        failureScreen.tabIndex = "-1"
        failureScreen.classList.add("failure_screen")
        failureScreen.style.backgroundColor = this.getBackgroundColor()
        failureScreen.onkeyup = (event) => {
            if (event.key == "Shift") {
                failureScreen.remove()
                this.level = 1
                this.scoreSystem.resetScore()
                this.startGame()
            }
        }
        document.getElementById("game-area").appendChild(failureScreen)
        failureScreen.focus()
        // }
    }

    allVirusesDestroyed() {
        this.isLevelBeaten = true
    }

    getBackgroundColor() {
        var colors = ["cyan", "purple", "pink"]
        return colors[this.level % colors.length]
    }

    setBackgroundColors(color) {
        document.getElementById("game-area").style.backgroundColor = color
        document.getElementById("bottle__neck").style.backgroundColor = color
        document.getElementById("bottle__body").style.backgroundColor = color
    }
}