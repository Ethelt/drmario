"use strict";

import { InfoManager } from "./infoManager.mjs";

// Class that manages all viruses on the board
export class VirusManager {
    constructor(gameManager) {
        this.gameManager = gameManager
        this.viruses = []
    }

    // Spawn viruses, their number depends on the level
    spawnViruses(level) {
        this.viruses = []
        var colors = this.gameManager.colors
        for (var i = 0; i < 4 * level; i++) {
            var color = colors[i % colors.length]
            var position = this.gameManager.board.getRandomFreePosition(6)
            this.viruses.push(this.gameManager.board.spawnVirus(color, position, this))
        }
        InfoManager.updateViruses(this.viruses.length) // Update number of viruses on the InfoBoard
    }

    // Fires when a virus is destroyed, updates game data about viruses and then removes the virus
    virusDestroyed(virus) {
        this.gameManager.scoreSystem.incrementScore()
        var sameColoredViruses = this.viruses.filter(x => x.color == virus.color)
        // Start suffering animation of destroyed virus using its data
        // isFatal property desrcibes if that virus was the last one of its color
        this.gameManager.virusChoreographer.startSuffering({ color: virus.color, isFatal: sameColoredViruses.length > 1 ? false : true, initCounter: 0 })
        InfoManager.updateViruses(this.viruses.length - 1)
        this.destroyVirus(virus)
    }

    // Function that actually removes the virus from the game and let's the GameManager know if all of them were destroyed
    destroyVirus(virus) {
        this.viruses.splice(this.viruses.indexOf(virus), 1);
        if (this.viruses.length == 0) {
            this.gameManager.allVirusesDestroyed()
        }
    }
}