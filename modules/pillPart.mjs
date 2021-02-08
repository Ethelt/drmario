"use strict";

export class PillPart {
    constructor(pill, color) {
        this.pill = pill
        this.color = color
        this.position;
    }

    destroy() {
        this.pill.destroyPart(this)
    }
}