"use strict";

import { Board } from "./board.mjs"
import { InputManager } from "./inputManager.mjs"
import { VirusManager } from "./virusManager.mjs";
import { ScoreSystem } from "./scoreSystem.mjs";
import { InfoManager } from "./infoManager.mjs";
import { pillThrower } from "./pillThrower.mjs";
import { VirusChoreographer } from "./virusChoreographer.mjs";

export class GameManager {

    constructor() {
        this.board;
        this.activePill;
        this.isLevelBeaten = false;
        this.isFirstPill = true
        this.isLosing = false
        this.input = new InputManager(this);
        this.level = 1;
        this.colors = ["blue", "brown", "yellow"]
        this.virusManager = new VirusManager(this)
        this.scoreSystem = new ScoreSystem(this)
        this.pillThrower = new pillThrower(this)
        this.virusChoreographer = new VirusChoreographer(this.virusManager)
        this.scheduledDrop;
    }

    startGame(spawn = true) {
        this.isLosing = false
        this.scheduledDrop = null
        this.isLevelBeaten = false;
        this.board = new Board(8, 17);
        this.virusManager.spawnViruses(this.level)
        this.virusChoreographer.createDancers()
        this.virusChoreographer.startDance(true)
        this.pillThrower.changeDoctorSprite("high")
        InfoManager.updateLevel(this.level)
        if (spawn) {
            this.pillThrower.prepareNextPill()
            this.spawnPill()
        }
        this.setBackgroundColors(this.getBackgroundColor())
        this.board.render()
    }

    spawnPill() {
        if (!this.isLosing) {
            this.activePill = null
            this.board.render()
            var color = this.pillThrower.nextPillColor
            this.pillThrower.throwPill()
            this.input.inputBusy = true
            setTimeout(() => {
                var spawn = this.board.spawnPill(color)
                var spawnedPill = spawn.pill
                this.scheduledDrop = setTimeout(() => {
                    this.activePill = spawnedPill
                    this.dropActivePill()
                    this.input.inputBusy = false
                    this.pillThrower.prepareNextPill()
                }, 300)
            }, 2500)
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
                    if (this.board.board[1][3].content || this.board.board[1][4].content) {
                        this.isLosing = true
                        setTimeout(() => this.finishGame(), 300)
                    } else {
                        this.spawnPill()
                    }
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
                    setTimeout(() => {
                        this.board.render()
                        this.finishLevelIfBeaten()
                        if (!this.isLevelBeaten) {
                            if (this.board.board[1][3].content || this.board.board[1][4].content) {
                                this.isLosing = true
                                setTimeout(() => this.finishGame(), 300)
                            } else {
                                this.spawnPill()
                            }
                            this.input.inputBusy = true
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
            document.getElementById("game_area").appendChild(victoryScreen)
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
        // if (document.getElementsByClassName("failure_screen") == []) {
        this.board.render()
        this.input.inputBusy = true
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
        document.getElementById("game_area").appendChild(failureScreen)
        this.pillThrower.stopThrow()
        this.pillThrower.changeDoctorSprite("failed")
        this.virusChoreographer.startCelebration()
        failureScreen.focus()
        // }
    }

    allVirusesDestroyed() {
        this.isLevelBeaten = true
    }

    getBackgroundColor() {
        var colors = ["pink", "purple", "green"]
        return colors[this.level % colors.length]
    }

    setBackgroundColors(color) {
        document.getElementById("game_area").style.backgroundColor = color
        document.getElementById("bottle__neck").style.backgroundColor = color
        document.getElementById("bottle__body").style.backgroundColor = color
    }
}