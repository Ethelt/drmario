"use strict";

export class InputManager {
    controlScheme = {
        moveLeft: ["ArrowLeft", "a"],
        moveRight: ["ArrowRight", "d"],
        rotateLeft: ["ArrowUp", "w"],
        rotateRight: ["Shift"],
        moveDown: ["ArrowDown", "s"]
    }

    inputBusy = false;

    constructor(gameManager) {
        this.gameManager = gameManager

        document.addEventListener("keydown", (event) => {
            if (this.gameManager.activePill) {
                this.handleKeyDown(event)
            }
        })
        document.addEventListener("keyup", (event) => {
            if (this.gameManager.activePill) {
                this.handleKeyUp(event)
            }
        })
    }

    handleKeyDown(event) {
        // shift: event.key == "Shift"; arrow rigth: event.key == "ArrowRight"
        if (this.controlScheme.moveDown.includes(event.key)) {
            clearTimeout(this.gameManager.scheduledDrop)
            this.inputBusy = true
            this.gameManager.dropActivePill(true)
        }
        if (!this.inputBusy) {
            if (this.controlScheme.moveLeft.includes(event.key)) {
                this.gameManager.moveActivePill([0, -1])
            }
            if (this.controlScheme.moveRight.includes(event.key)) {
                this.gameManager.moveActivePill([0, 1])
            }
        }
    }

    handleKeyUp(event) {
        if (this.controlScheme.moveDown.includes(event.key)) {
            clearTimeout(this.gameManager.scheduledDrop)
            this.inputBusy = false
            this.gameManager.dropActivePill(false)
        }
        if (!this.inputBusy) {
            if (this.controlScheme.rotateLeft.includes(event.key)) {
                this.gameManager.rotateActivePill("left")
            }
            if (this.controlScheme.rotateRight.includes(event.key)) {
                this.gameManager.rotateActivePill("right")
            }
        }
    }
}