"use strict";

import { InfoManager } from "./infoManager.mjs";

export class VirusManager {
    constructor(gameManager) {
        this.gameManager = gameManager
        this.viruses = []
    }

    spawnViruses(level) {
        this.viruses = []
        var colors = this.gameManager.colors
        for (var i = 0; i < 4 * level; i++) {
            var color = colors[i % colors.length]
            var position = this.gameManager.board.getRandomFreePosition(6)
            this.viruses.push(this.gameManager.board.spawnVirus(color, position, this))
        }
        InfoManager.updateViruses(this.viruses.length)
    }

    virusDestroyed(virus) {
        this.gameManager.scoreSystem.incrementScore()
        this.destroyVirus(virus)
    }

    destroyVirus(virus) {
        this.viruses.splice(this.viruses.indexOf(virus), 1);
        InfoManager.updateViruses(this.viruses.length)
        if (this.viruses.length == 0) {
            this.gameManager.allVirusesDestroyed()
        }
    }
}