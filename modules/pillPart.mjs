"use strict";

export class PillPart {
    constructor(pill, color) {
        this.pill = pill
        this.color = color
        this.position;
        this.sprite;
    }

    destroy() {
        this.pill.destroyPart(this)
        this.setSprite("o")
    }

    setSprite(type) {
        this.sprite = `url(./images/pills/${this.color}/${type}.png)`
    }
}