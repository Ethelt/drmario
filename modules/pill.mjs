"use strict";

import { PillPart } from "./pillPart.mjs";

export class Pill {
    constructor(color) {
        var colors = color.split("|")
        this.parts = [new PillPart(this, colors[0]), new PillPart(this, colors[1])]
        this.isHorizontal = true;
    }

    destroyPart(part) {
        this.parts.splice(this.parts.indexOf(part), 1)
    }
}