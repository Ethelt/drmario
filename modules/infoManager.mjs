"use strict";

import { Utilities } from "./utilities.mjs"

export class InfoManager {
    // constructor() {
    //     this.level = level
    //     this.viruses = viruses
    // }

    static infoBoard = document.getElementById("info")

    static updateLevel(level) {
        var levelImage = Utilities.convertStringToImage(level.toString().padStart(2, "0"))
        levelImage.style.top = "128px"
        levelImage.style.right = "64px"
        this.infoBoard.appendChild(levelImage)
    }

    static updateViruses(viruses) {
        var virusesImage = Utilities.convertStringToImage(viruses.toString().padStart(2, "0"))
        virusesImage.style.bottom = "64px"
        virusesImage.style.right = "64px"
        this.infoBoard.appendChild(virusesImage)

    }
}