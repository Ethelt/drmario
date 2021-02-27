"use strict";

// Part of Pill, it actually exists on the board and interacts with other objects
export class PillPart {
    constructor(pill, color) {
        this.pill = pill
        this.color = color
        this.position;
        this.sprite;
    }

    destroy() {
        this.pill.destroyPart(this)
        this.setSprite("o") // Set "o" sprite before destruction as a rudimentary destruction animation. It dissapears when PillPart stops being rendered by Board.
    }

    setSprite(type) {
        this.sprite = `url(./images/pills/${this.color}/${type}.png)`
    }
}