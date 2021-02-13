"use strict";

export class Virus {
    constructor(color, position, virusManager) {
        this.color = color
        this.position = position
        this.virusManager = virusManager
        this.sprite = `url("./images/viruses/${color}.png")`
    }

    destroy() {
        this.virusManager.virusDestroyed(this)
        this.setDestructionSprite()
    }

    setDestructionSprite() {
        this.sprite = `url(./images/pills/${this.color}/x.png)`
        setTimeout(() => {
            this.sprite = ""
        }, 500)
    }
}