"use strict";

import { Board } from "./board.mjs"
import { InputManager } from "./inputManager.mjs"
import { Virus } from "./virus.mjs";
import { VirusManager } from "./virusManager.mjs";

export class GameManager {

    constructor() {
        this.board;
        this.activePill;
        this.isGameOver = false;
        this.input = new InputManager(this);
        this.level = 1;
        this.colors = ["blue", "red", "yellow"]
        this.virusManager = new VirusManager(this)
        this.scheduledDrop;
    }

    startGame() {
        this.isGameOver = false;
        this.board = new Board(8, 16);
        // this.viruses = this.spawnViruses()
        this.virusManager.spawnViruses(this.level)
        this.spawnPill()
        this.board.render()
    }

    spawnPill() {
        this.input.inputBusy = false
        this.board.render()
        var color = `${this.colors[Math.floor(Math.random() * this.colors.length)]}|${this.colors[Math.floor(Math.random() * this.colors.length)]}`
        // var color = "red|blue"
        this.activePill = this.board.spawnPill(color)
        this.scheduledDrop = setTimeout(() => this.dropActivePill(), 1000)
    }

    dropActivePill(rushed = false) {
        var pillLanded = !this.board.movePill(this.activePill, [1, 0])
        if (pillLanded) {
            var objectsToRemove = this.getObjectsToRemove(this.activePill)
            objectsToRemove.forEach(object => {
                if (object instanceof Virus) {
                    this.virusManager.destroyVirus(object)
                }
                this.board.clearObject(object)
            })
            if (this.isGameOver) {
                this.level += 1
                alert("You Win!")
                this.startGame()
            }
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

    allVirusesDestroyed() {
        this.isGameOver = true
    }
}