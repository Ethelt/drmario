"use strict";

import { Board } from "./board.mjs"
import { InputManager } from "./inputManager.mjs"
import { VirusManager } from "./virusManager.mjs";
import { ScoreSystem } from "./scoreSystem.mjs";
import { InfoManager } from "./infoManager.mjs";
import { pillThrower } from "./pillThrower.mjs";
import { VirusChoreographer } from "./virusChoreographer.mjs";

/* 
Main class responsible for managing the game
It serves as a central hub, connecting different modules and dealing with major tasks
*/

export class GameManager {

    constructor() {
        this.board; // contains instance of Board class, initialized in startGame()
        this.activePill; // contains instance of Pill class, that is currently being controlled by the player
        this.isLevelBeaten = false;
        this.isLosing = false
        this.level = 1;
        this.colors = ["blue", "brown", "yellow"] // possible colors of pills and viruses
        this.input = new InputManager(this);
        this.virusManager = new VirusManager(this)
        this.scoreSystem = new ScoreSystem(this)
        this.pillThrower = new pillThrower(this)
        this.virusChoreographer = new VirusChoreographer(this.virusManager)
        this.scheduledDrop; // timeout containing next drop of the active pill
    }

    startGame() {
        // Set all variables at the start of each level (includes staring the game for the first time)
        this.isLosing = false
        this.scheduledDrop = null
        this.isLevelBeaten = false;
        this.board = new Board(8, 16); // Width and height of the board
        this.virusManager.spawnViruses(this.level)
        this.virusChoreographer.createDancers()
        this.virusChoreographer.startDance(true)
        this.pillThrower.changeDoctorSprite("high")
        InfoManager.updateLevel(this.level)
        this.pillThrower.prepareNextPill()
        this.spawnPill()
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
            }, 2500) // Time necessary for pill throwing animation to play; didn't have time before the deadline, to make calculating this automatic.
        }
    }

    // Function responsible for dropping the active pill one row down.
    // It is also responsible for destroying the objects if necessary (when there is more than 4 in a row) and starting gravity steps
    // Rushed parameter determines how quickly things should happen, it is true when player initiates accelerated fall (see: InputManager)
    // TODO: This function is really bad and is a source of 90% of problems with this code, but I didn't have time to rewrite it before deadline. It needs to go if I ever decide to continue this project
    dropActivePill(rushed = false) {
        var pillLanded = false
        if (this.activePill) {
            var pillLanded = !this.board.movePill(this.activePill, [1, 0])
        }
        if (pillLanded) {
            // If there any elements that can be destroyed, destroy them
            var objectsToRemove = this.getObjectsToRemove(this.activePill)
            objectsToRemove.forEach(object => {
                this.board.clearObject(object)
            })
            // If any elements were destroyed start doing gravity, else check if player lost the game
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

    // Geto objects to remove in rows and columns of the pill
    getObjectsToRemove(pill) {
        var objectsToRemove = new Set()
        pill.parts.forEach(part => {
            objectsToRemove = new Set([...objectsToRemove, ...this.board.getObjectsToRemove(part.position)])
        });
        return objectsToRemove
    }

    // Make all pills not supported by anything fall and check if they cause any objects to be destroyed
    // objectsToRemove is an argument, because it needs to be late one cycle, because of timing issues with animations
    doGravity(objectsToRemove) {
        this.input.inputBusy = true
        this.board.render()
        var result = this.board.doGravityStep() // Lowers all eligible pills by one row, returns informations about this move
        var wasAnythingMoved = result.wasAnythingMoved
        var wereObjectsCleared = false

        setTimeout(() => {
            var objectsToRemove = new Set()
            result.stablePills.forEach(pill => { // Check if any pills that fell caused another objects to be destroyed
                objectsToRemove = new Set([...objectsToRemove, ...this.getObjectsToRemove(pill)])
            })
            objectsToRemove.forEach(object => {
                this.board.clearObject(object)
                wereObjectsCleared = true
            })
            if (wasAnythingMoved) {
                this.scheduledDrop = setTimeout(() => this.doGravity(objectsToRemove), 200)
            } else {
                if (wereObjectsCleared) { // Destroying objects could cause different pills to be able to fall, we check if that was the case
                    this.scheduledDrop = setTimeout(() => this.doGravity(objectsToRemove), 200)
                } else {
                    setTimeout(() => {
                        this.board.render()
                        this.finishLevelIfBeaten()
                        if (!this.isLevelBeaten) {
                            if (this.board.board[1][3].content || this.board.board[1][4].content) { // Check if player lost
                                this.isLosing = true
                                setTimeout(() => this.finishGame(), 300)
                            } else {
                                this.spawnPill() // Calculating gravity ends, spawn next pill
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
            var victoryScreen = document.createElement("div") // Screen thats informs player about victory and handles going to the next level
            victoryScreen.tabIndex = "-1" // Make element focusable, but unable to be focused on by using tab key
            victoryScreen.classList.add("victory_screen")
            victoryScreen.style.backgroundColor = this.getBackgroundColor()
            victoryScreen.onkeyup = () => {
                victoryScreen.remove()
                this.startNextLevel()
            }
            document.getElementById("game_area").appendChild(victoryScreen)
            victoryScreen.focus() // Focus on this element to enable keybord events on it
        }
    }

    startNextLevel() {
        this.level += 1
        this.inputBusy = false
        this.startGame()
    }

    // Executed when player loses, shows the info about it and prepares the game for restart
    finishGame() {
        this.board.render()
        this.input.inputBusy = true
        this.scoreSystem.saveScore()
        var failureScreen = document.createElement("div")
        failureScreen.tabIndex = "-1" // Make element focusable, but unable to be focused on by using tab key
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
        failureScreen.focus() // Focus on this element to enable keybord events on it
        // }
    }

    // Function executed by VirusManager
    allVirusesDestroyed() {
        this.isLevelBeaten = true
    }

    // Used to determine color of background, bottle and Game Over and Level Cleared screens
    getBackgroundColor() {
        var colors = ["pink", "purple", "green"]
        return colors[this.level % colors.length]
    }

    // Sets background color of some game area elements
    // Neck and body of the bottle are separate, because bottle needs to be higher z-index than background, but the neck is narrower and it kept obstructing it
    setBackgroundColors(color) {
        document.getElementById("game_area").style.backgroundColor = color
        document.getElementById("bottle__neck").style.backgroundColor = color
        document.getElementById("bottle__body").style.backgroundColor = color
    }
}