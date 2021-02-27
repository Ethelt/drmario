"use strict";

import { Utilities } from "./utilities.mjs"

// This class updates the information in the lower right corner of the screen
export class InfoManager {

    static infoBoard = document.getElementById("info")

    static updateLevel(level) {
        var levelImage = Utilities.convertNumericStringToImage(level.toString().padStart(2, "0"))
        levelImage.style.top = "128px"
        levelImage.style.right = "64px"
        this.infoBoard.appendChild(levelImage)
    }

    static updateViruses(viruses) {
        var virusesImage = Utilities.convertNumericStringToImage(viruses.toString().padStart(2, "0"))
        virusesImage.style.bottom = "64px"
        virusesImage.style.right = "64px"
        this.infoBoard.appendChild(virusesImage)

    }
}