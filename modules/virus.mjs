"use strict";

export class Virus {
    constructor(color, position, virusManager) {
        this.color = color
        this.position = position
        this.virusManager = virusManager
    }

    destroy() {
        this.virusManager.virusDestroyed(this)
    }
}