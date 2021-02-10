"use strict";

import { Board } from "./board.mjs"
import { InputManager } from "./inputManager.mjs"
import { VirusManager } from "./virusManager.mjs";
import { ScoreSystem } from "./scoreSystem.mjs";

export class GameManager {

    constructor() {
        this.board;
        this.activePill;
        this.isLevelBeaten = false;
        this.input = new InputManager(this);
        this.level = 1;
        this.colors = ["blue", "red", "yellow"]
        this.virusManager = new VirusManager(this)
        this.scoreSystem = new ScoreSystem(this)
        this.scheduledDrop;
    }

    startGame() {
        console.log(`Max score: ${this.scoreSystem.getMaxScore() ? this.scoreSystem.getMaxScore() : 0}`)
        this.scheduledDrop = null
        this.isLevelBeaten = false;
        this.board = new Board(8, 16);
        this.virusManager.spawnViruses(this.level)
        this.spawnPill()
        this.board.render()
    }

    spawnPill() {
        this.input.inputBusy = false
        this.board.render()
        var color = `${this.colors[Math.floor(Math.random() * this.colors.length)]}|${this.colors[Math.floor(Math.random() * this.colors.length)]}`
        // var color = "red|blue"
        var spawn = this.board.spawnPill(color)
        this.activePill = spawn.pill
        if (spawn.isLosing) {
            setTimeout(() => this.finishGame(), 1000)
        } else {
            this.scheduledDrop = setTimeout(() => this.dropActivePill(), 1000)
        }
    }

    dropActivePill(rushed = false) {
        var pillLanded = !this.board.movePill(this.activePill, [1, 0])
        if (pillLanded) {
            var objectsToRemove = this.getObjectsToRemove(this.activePill)
            objectsToRemove.forEach(object => {
                this.board.clearObject(object)
            })

            this.finishLevelIfBeaten()
            if (objectsToRemove.size > 0) {
                this.activePill = null
                this.doGravity(new Set())
                return 1
            } else {
                this.spawnPill()
            }
        } else {
            this.scheduledDrop = setTimeout(() => this.dropActivePill(rushed), rushed ? 100 : 1000)
        }
        this.board.render()
        this.finishLevelIfBeaten()
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
        this.board.render()
        var result = this.board.doGravityStep()
        var areMovesPossible = result.areMovesPossible
        var wereObjectsCleared = false
        objectsToRemove.forEach(object => {
            this.board.clearObject(object)
            wereObjectsCleared = true
        })
        var objectsToRemove = new Set()
        result.stablePills.forEach(pill => {
            objectsToRemove = new Set([...objectsToRemove, ...this.getObjectsToRemove(pill)])
        })
        if (areMovesPossible) {
            this.scheduledDrop = setTimeout(() => this.doGravity(objectsToRemove), 1000)
        } else {
            if (wereObjectsCleared) {
                this.scheduledDrop = setTimeout(() => this.doGravity(objectsToRemove), 1000)
            } else {
                setTimeout(() => {
                    this.board.render()
                    this.spawnPill()
                }, wereObjectsCleared ? 1000 : 10)
            }
        }
    }

    finishLevelIfBeaten() {
        if (this.isLevelBeaten) {
            this.board.render()
            this.level += 1
            this.scoreSystem.saveScore()
            alert("You Win!")
            this.startGame()
        }
    }

    finishGame() {
        this.board.render()
        alert("You Lost!")
        this.startGame()
    }

    allVirusesDestroyed() {
        this.isLevelBeaten = true
    }
}