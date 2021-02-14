"use strict";

export class pillThrower {
    constructor(gameManager) {
        this.nextPillColor;
        this.pill = []
        this.gameManager = gameManager;
        this.currentStep = 0
        this.throw;
        this.doctor = document.getElementById("doctor")
        this.path1 = [this.step(96, 288, "left"), this.step(96, 288, "left"), this.step(96, 288, "down"), this.step(64, 288, "right"), this.step(32, 320, "up"), this.step(32, 352, "left"), this.step(32, 352, "down"), this.step(32, 352, "right"), this.step(0, 384, "up"), this.step(32, 416, "left"), this.step(32, 416, "down"), this.step(32, 416, "right"), this.step(0, 448, "up"), this.step(32, 480, "left"), this.step(32, 480, "down"), this.step(32, 480, "right"), this.step(0, 512, "up"), this.step(32, 544, "left"), this.step(32, 544, "down"), this.step(64, 544, "right"), this.step(32, 576, "up"), this.step(64, 608, "left"), this.step(96, 608, "left"), this.step(128, 608, "left"), this.step(160, 608, "left"), this.step(160, 608, "left"), this.step(160, 608, "left")]
        this.path2 = [this.step(96, 256, "right"), this.step(96, 256, "right"), this.step(64, 288, "up"), this.step(64, 320, "left"), this.step(64, 320, "down"), this.step(32, 320, "right"), this.step(0, 352, "up"), this.step(32, 384, "left"), this.step(32, 384, "down"), this.step(32, 384, "right"), this.step(0, 416, "up"), this.step(32, 448, "left"), this.step(32, 448, "down"), this.step(32, 448, "right"), this.step(0, 480, "up"), this.step(32, 512, "left"), this.step(32, 512, "down"), this.step(32, 512, "right"), this.step(0, 544, "up"), this.step(64, 576, "left"), this.step(64, 576, "down"), this.step(64, 576, "right"), this.step(96, 576, "right"), this.step(128, 576, "right"), this.step(160, 576, "right"), this.step(160, 576, "right"), this.step(160, 576, "right")]
    }

    prepareNextPill() {
        this.stopThrow()
        this.pill = []
        this.nextPillColor = `${this.gameManager.colors[Math.floor(Math.random() * this.gameManager.colors.length)]}|${this.gameManager.colors[Math.floor(Math.random() * this.gameManager.colors.length)]}`
        var pillPartElement = document.createElement("div")
        pillPartElement.classList.add("pill_part")
        document.getElementById("game_area").appendChild(pillPartElement)
        var pillPart = this.pillPart(pillPartElement, this.nextPillColor.split("|")[0], this)
        pillPart.updateSprite("left")
        pillPart.setPosition(96, 288)
        this.pill.push(pillPart)

        var pillPartElement = document.createElement("div")
        pillPartElement.classList.add("pill_part")
        document.getElementById("game_area").appendChild(pillPartElement)
        var pillPart = this.pillPart(pillPartElement, this.nextPillColor.split("|")[1])
        pillPart.updateSprite("right")
        pillPart.setPosition(96, 256)
        this.pill.push(pillPart)
    }

    throwPill() {
        this.throw = setInterval(() => {
            if (this.currentStep == this.path1.length) {
                this.stopThrow()
            } else {
                if (this.currentStep == 2) {
                    this.changeDoctorSprite("medium")
                } else if (this.currentStep == 4) {
                    this.changeDoctorSprite("low")
                }
                var step = this.path1[this.currentStep]
                this.pill[0].setPosition(step.top, step.right)
                this.pill[0].updateSprite(step.direction)
                var step = this.path2[this.currentStep]
                this.pill[1].setPosition(step.top, step.right)
                this.pill[1].updateSprite(step.direction)
                this.currentStep += 1
            }
        }, 100)
    }

    stopThrow() {
        clearInterval(this.throw)
        if (this.pill && this.pill.length > 0) {
            this.pill[0].updateSprite(null)
            this.pill[1].updateSprite(null)
        }
        if (!this.gameManager.isLosing) {
            this.changeDoctorSprite("high")
        }
        this.currentStep = 0
    }

    pillPart(element, color, parent) {
        var pillPart = {
            element: element,
            color: color,
            parent: parent,
            updateSprite: function (direction) {
                if (direction) {
                    this.element.style.backgroundImage = `url(./images/pills/${this.color}/${direction}.png)`
                } else {
                    this.element.style.backgroundImage = ''
                }
            },
            setPosition: function (top, right) {
                this.element.style.top = `${top}px`
                this.element.style.right = `${right}px`
            }
        }
        return pillPart
    }

    step(top, right, direction) {
        var step = { top: top, right: right, direction: direction }
        return step
    }

    changeDoctorSprite(image) {
        this.doctor.src = `images/doctor/${image}.png`
    }

    // throwPath1 = () => {  }
}