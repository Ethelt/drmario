"use strict";

export class VirusChoreographer {
    constructor(virusManager) {
        this.virusManager = virusManager
        this.element = document.getElementById("magnifier")
        this.dancers = []
        this.positions = [[1, 4], [1, 5], [2, 6], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [7, 6], [7, 5], [7, 4], [7, 3], [6, 2], [5, 2], [4, 2], [3, 2], [2, 3], [1, 4]]
        this.positionCounter = 0
        this.moveCounter = 4
        this.moveInterval;
        this.dyingDancers = []
        // [1,4; 5,7; 6,2]
        // 0, 6, 12

    }

    createDancers() {
        this.clearBodies()
        var dancers = [];
        ["brown", "blue", "yellow"].forEach((color, i) => {
            var element = document.createElement("div")
            element.classList.add("dancer")
            this.element.appendChild(element)
            var dancer = new DancingVirus(color, 6 * i, element)
            dancers.push(dancer)
        })
        this.dancers = dancers
    }

    startDance(reset = false) {
        clearInterval(this.moveInterval)
        this.moveCounter = 4
        this.positionCounter = reset ? 0 : this.positionCounter + 1
        this.dance()
        this.moveInterval = setInterval(() => { this.dance() }, 300)
    }

    dance() {
        // var colors = ["blue", "red", "yellow", "red"]
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

    startCelebration() {
        clearInterval(this.moveInterval)
        this.moveCounter = 0
        this.moveInterval = setInterval(() => { this.celebrate() }, 300)
    }

    celebrate() {
        this.dancers.forEach(dancer => {
            dancer.setSprite(2 + 2 * this.moveCounter)
        })
        this.moveCounter = (this.moveCounter + 1) % 2
    }

    startSuffering(data) {
        if (this.dyingDancers.length == 0) {
            clearInterval(this.moveInterval)
            this.moveCounter = 4
            // this.suffer()
            this.moveInterval = setInterval(() => { this.suffer() }, 300)
        }
        data.initCounter = this.moveCounter
        this.dyingDancers.push(data)
    }

    suffer() {
        if (this.dyingDancers.length == 0) {
            this.startDance()
        } else {
            var currentlyDying = this.dyingDancers.filter(dancer => dancer.initCounter + 10 == this.moveCounter)
            if (currentlyDying.length > 0) {
                currentlyDying.forEach(dying => {
                    if (dying.isFatal) {
                        var dyingDancer = this.dancers.find(dancer => dancer.color == dying.color)
                        dyingDancer.destroy()
                        this.dancers.splice(this.dancers.indexOf(dyingDancer), 1)
                    }
                    this.dyingDancers.splice(this.dyingDancers.indexOf(dying), 1)
                })
            } else {
                this.dancers.forEach(dancer => {
                    if (this.dyingDancers.map(x => x.color).includes(dancer.color)) {
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

    clearBodies() {
        clearInterval(this.moveInterval)
        this.dancers.forEach(dancer => {
            dancer.destroy()
        })
        this.element.innerHTML = ""
    }
}

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