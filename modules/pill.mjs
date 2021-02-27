"use strict";

import { PillPart } from "./pillPart.mjs";

// Class representing a pill, it is made of two instances of PillPart
// It's worth noting that a pill is not something that exists on the map, it only manages its PillParts
export class Pill {
    constructor(color) {
        var colors = color.split("|")
        this.parts = [new PillPart(this, colors[0]), new PillPart(this, colors[1])]
        this.isHorizontal = true;
        this.updatePartsSprites()
    }

    destroyPart(part) {
        this.parts.splice(this.parts.indexOf(part), 1)
        this.updatePartsSprites()
    }

    // PillParts have different sprites based on their rotation and position in Pill, this function handles that
    updatePartsSprites() {
        if (this.parts.length > 1) {
            if (this.isHorizontal) {
                this.parts[0].setSprite("left")
                this.parts[1].setSprite("right")
            } else {
                this.parts[0].setSprite("down")
                this.parts[1].setSprite("up")
            }
        } else if (this.parts.length > 0) {
            this.parts[0].setSprite("dot")
        }
    }
}