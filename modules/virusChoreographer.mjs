"use strict";

// Class managing the dancing viruses in the bottom-left corner
export class VirusChoreographer {
    constructor(virusManager) {
        this.virusManager = virusManager
        this.element = document.getElementById("magnifier")
        this.dancers = []
        // Positions of viruses in different frames of movement cycle
        // Numbers are squares from top and left of a magnifier (every square is 32px)
        this.positions = [[1, 4], [1, 5], [2, 6], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [7, 6], [7, 5], [7, 4], [7, 3], [6, 2], [5, 2], [4, 2], [3, 2], [2, 3], [1, 4]]
        this.positionCounter = 0 // Governs what position will a virus have
        this.moveCounter = 4 // Governs what sprites will viruses have
        this.moveInterval;
        this.sufferingDancers = [] // Array containing viruses that are playing their death animation

    }

    createDancers() {
        this.clearBodies() // Destroy previous sprites
        var dancers = [];
        this.sufferingDancers = [];
        ["brown", "blue", "yellow"].forEach((color, i) => {
            var element = document.createElement("div")
            element.classList.add("dancer")
            this.element.appendChild(element)
            var dancer = new DancingVirus(color, 6 * i, element)
            dancers.push(dancer)
        })
        this.dancers = dancers
    }

    // Set variables and create inverval for moving in circle
    startDance(reset = false) {
        clearInterval(this.moveInterval)
        this.moveCounter = 4
        this.positionCounter = reset ? 0 : this.positionCounter + 1
        this.dance()
        this.moveInterval = setInterval(() => { this.dance() }, 300)
    }

    // Move in a circle in a magnifier, according to positions array
    dance() {
        if (this.moveCounter == 5) {
            this.dancers.forEach(dancer => {
                var position = this.positions[(this.positionCounter + dancer.offset) % this.positions.length]
                dancer.setPosition(position[0] * 32, position[1] * 32)
            })
            this.moveCounter = 1
            this.positionCounter += 1
        } else {
            this.dancers.forEach(dancer => {
                if (this.moveCounter != 4) {
                    dancer.setSprite(this.moveCounter)
                } else {
                    dancer.setSprite(2)
                }
            })
            this.moveCounter += 1
        }
    }

    // Set variables and create inverval for dancing on Game Over screen
    startCelebration() {
        clearInterval(this.moveInterval)
        this.moveCounter = 0
        this.moveInterval = setInterval(() => { this.celebrate() }, 300)
    }

    // Play animation of dancing on Game Over screen
    celebrate() {
        this.dancers.forEach(dancer => {
            dancer.setSprite(2 + 2 * this.moveCounter)
        })
        this.moveCounter = (this.moveCounter + 1) % 2
    }

    // Set variables and create inverval for playing death animation
    startSuffering(data) {
        if (this.sufferingDancers.length == 0) {
            clearInterval(this.moveInterval)
            this.moveCounter = 4
            this.moveInterval = setInterval(() => { this.suffer() }, 300)
        }
        data.initCounter = this.moveCounter
        this.sufferingDancers.push(data)
    }

    // Play the death animation after being destroyed, destroy a DancingVirus if all viruses of the same colors were destroyed
    suffer() {
        if (this.sufferingDancers.length == 0) {
            this.startDance() // Return to dance animation if there is no DancingViruses that are playing the animation
        } else {
            var currentlyRecovering = this.sufferingDancers.filter(dancer => dancer.initCounter + 10 == this.moveCounter) // DancingViruses that were playing the animation for 10 frames
            if (currentlyRecovering.length > 0) {
                currentlyRecovering.forEach(recovering => {
                    if (recovering.isFatal) { // If all viruses of the same color were destroyed
                        var dyingDancer = this.dancers.find(dancer => dancer.color == recovering.color)
                        dyingDancer.destroy()
                        this.dancers.splice(this.dancers.indexOf(dyingDancer), 1) // Remove from dancers list
                    }
                    this.sufferingDancers.splice(this.sufferingDancers.indexOf(dying), 1) // Remove from suffering dancers list
                })
            } else {
                // Play death animation
                this.dancers.forEach(dancer => {
                    if (this.sufferingDancers.map(x => x.color).includes(dancer.color)) {
                        dancer.setSprite(5 + (this.moveCounter % 2))
                    } else {
                        var counter = (this.moveCounter % 4) + 1
                        if (this.counter != 4) {
                            dancer.setSprite(counter)
                        } else {
                            dancer.setSprite(2)
                        }
                    }
                })
            }
            this.moveCounter += 1
        }
    }

    // Clear all existing virus sprites
    clearBodies() {
        clearInterval(this.moveInterval)
        this.dancers.forEach(dancer => {
            dancer.destroy()
        })
        this.element.innerHTML = ""
    }
}

// Class representing a single dancing virus
class DancingVirus {
    constructor(color, offset, element) {
        this.color = color
        this.offset = offset
        this.element = element
    }

    setPosition(left, top) {
        this.element.style.left = `${left}px`
        this.element.style.top = `${top}px`
    }

    setSprite(sprite) {
        this.element.style.backgroundImage = `url(./images/viruses/${this.color}/${sprite}.png)`
    }

    destroy() {
        this.element.style.backgroundImage = ""
    }
}