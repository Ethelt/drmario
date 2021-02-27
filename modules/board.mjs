"use strict";

import { Pill } from "./pill.mjs"
import { Virus } from "./virus.mjs";
import { Cell } from "./cell.mjs";

// This class holds the array representing the board and is responsible for updating and rendering it
export class Board {
    constructor(width, height) {
        this.width = width;
        this.height = height + 1; //Height of the board needs to be higher than the playable area, see fillAroundNeck() for more info
        this.board = this.createBoard();
        this.render();
    }

    createBoard() {
        var board = []
        for (var i = 0; i < this.height; i++) {
            board.push([])
            for (var j = 0; j < this.width; j++) {
                board[i].push(new Cell())
            }
        }
        board = this.fillAroundNeck(board)
        return board
    }

    // Player needs to be able to rotate the pill into the neck of the bottle, but not into the surrounding cells in the same row
    // This function fills them with invisible and uninteractable objects that prevent rotation and movement into them
    fillAroundNeck(board) {
        var rowToFill = board[0]
        var cellsToFill = [0, 1, 2, 5, 6, 7]
        cellsToFill.forEach(cellNumber => {
            rowToFill[cellNumber].content = { color: "" }
        })
        return board
    }

    spawnPill(color) {
        var pill = new Pill(color)
        this.board[1][3].content = pill.parts[0]
        pill.parts[0].position = [0, 3]
        this.board[1][4].content = pill.parts[1]
        pill.parts[1].position = [0, 4]
        return { pill: pill }
    }

    movePill(pill, direction) {
        var movePossible = true;
        pill.parts.forEach(part => {
            if ((part.position[0] + direction[0] < this.height && part.position[1] + direction[1] < this.width) && (part.position[0] + direction[0] >= 0 && part.position[1] + direction[1] >= 0)) {
                var content = this.board[part.position[0] + direction[0]][part.position[1] + direction[1]].content
                if (content != null && !pill.parts.includes(content)) {
                    movePossible = false;
                }
            } else {
                movePossible = false;
            }
        })

        if (movePossible) {
            pill.parts.forEach(part => {
                if (this.board[part.position[0]][part.position[1]].content == part) {
                    this.board[part.position[0]][part.position[1]].content = null
                }
                part.position[0] += direction[0]
                part.position[1] += direction[1]
                this.board[part.position[0]][part.position[1]].content = part
            })
        }

        return movePossible
    }

    rotatePillLeft(pill) {
        if (pill.isHorizontal) {
            var movingPart = pill.parts[1]
            if (this.board[movingPart.position[0] - 1][movingPart.position[1] - 1].content == null) {
                pill.isHorizontal = false
                this.board[movingPart.position[0]][movingPart.position[1]].content = null
                movingPart.position[0] -= 1
                movingPart.position[1] -= 1
                this.board[movingPart.position[0]][movingPart.position[1]].content = movingPart
                pill.updatePartsSprites()
            }
        } else {
            var movePossible = true
            if (pill.parts[0].position[1] == this.width - 1) {
                movePossible = this.movePill(pill, [0, -1])
            } else if (this.board[pill.parts[0].position[0]][pill.parts[1].position[1] + 1].content != null) {
                movePossible = false
            }
            if (movePossible) {
                pill.isHorizontal = true
                this.board[pill.parts[1].position[0]][pill.parts[1].position[1]].content = null
                this.board[pill.parts[0].position[0]][pill.parts[0].position[1]].content = pill.parts[1]
                pill.parts[1].position[0] += 1
                pill.parts[0].position[1] += 1
                this.board[pill.parts[0].position[0]][pill.parts[0].position[1]].content = pill.parts[0]
                pill.parts.push(pill.parts.shift())

                pill.updatePartsSprites()
            } else if (this.board[pill.parts[0].position[0]][pill.parts[0].position[1] - 1].content == null && pill.parts[0].position[1] == this.width - 1) {
                pill.isHorizontal = true
                pill.parts[0].position[1] -= 1
                this.board[pill.parts[0].position[0]][pill.parts[0].position[1]].content = pill.parts[0]
                var movingPart = pill.parts[1]
                this.board[movingPart.position[0]][movingPart.position[1]].content = null
                movingPart.position[0] += 1
                this.board[movingPart.position[0]][movingPart.position[1]].content = movingPart

                pill.updatePartsSprites()
            }
        }
    }

    rotatePillRight(pill) {
        if (pill.isHorizontal) {
            if (this.board[pill.parts[0].position[0] - 1][pill.parts[0].position[1]].content == null) {
                pill.isHorizontal = false
                this.board[pill.parts[1].position[0]][pill.parts[1].position[1]].content = null
                pill.parts[0].position[0] -= 1
                pill.parts[1].position[1] -= 1
                this.board[pill.parts[0].position[0]][pill.parts[0].position[1]].content = pill.parts[0]
                this.board[pill.parts[1].position[0]][pill.parts[1].position[1]].content = pill.parts[1]
                pill.parts.push(pill.parts.shift())
                pill.updatePartsSprites()
            }
        } else {
            var movePossible = true
            if (pill.parts[0].position[1] == this.width - 1) {
                movePossible = this.movePill(pill, [0, -1])
            } else if (this.board[pill.parts[0].position[0]][pill.parts[1].position[1] + 1].content != null) {
                // movePossible = this.movePill(pill, [0, -1])
                movePossible = false
            }
            if (movePossible) {
                pill.isHorizontal = true
                var movingPart = pill.parts[1]
                this.board[movingPart.position[0]][movingPart.position[1]].content = null
                movingPart.position[0] += 1
                movingPart.position[1] += 1
                this.board[movingPart.position[0]][movingPart.position[1]].content = movingPart
                pill.updatePartsSprites()
            } else if (this.board[pill.parts[0].position[0]][pill.parts[0].position[1] - 1].content == null && pill.parts[0].position[1] == this.width - 1) {
                pill.isHorizontal = true
                pill.parts[0].position[1] -= 1
                this.board[pill.parts[0].position[0]][pill.parts[0].position[1]].content = pill.parts[0]
                var movingPart = pill.parts[1]
                this.board[movingPart.position[0]][movingPart.position[1]].content = null
                movingPart.position[0] += 1
                this.board[movingPart.position[0]][movingPart.position[1]].content = movingPart

                pill.updatePartsSprites()
            }

            // pill.isHorizontal = true
            // var movingPart = pill.parts[1]
            // var bottomPart = pill.part[0]

            // this.board[movingPart.position[0]][movingPart.position[1]].content = null
            // movingPart.position[0] += 1
            // movingPart.position[1] += 1
            // this.board[movingPart.position[0]][movingPart.position[1]].content = movingPart
        }
    }

    spawnVirus(color, position, virusManager) {
        var virus = new Virus(color, position, virusManager)
        this.board[position[0]][position[1]].content = virus
        return virus
    }

    // Get objects to remove in a given row and column.
    // Objects can only be romoved if there is 4+ objects of the same color in line
    getObjectsToRemove(position) {
        var objectsToRemove = new Set()
        var row = this.getRow(position[0])
        var column = this.getColumn(position[1])
        var markedCells = []
        var lines = [row, column]
        lines.forEach(line => {
            line.forEach(cell => {
                if (cell.content != null) {
                    if (markedCells.length == 0) {
                        markedCells.push(cell.content)
                    } else {
                        if (markedCells[0].color == cell.content.color) {
                            markedCells.push(cell.content)
                        } else {
                            markedCells = [cell.content]
                        }

                        if (markedCells.length >= 4) {
                            objectsToRemove = new Set([...objectsToRemove, ...markedCells])
                        }
                    }
                } else {
                    markedCells = []
                }
            })
            if (markedCells.length >= 4) {
                objectsToRemove = new Set([...objectsToRemove, ...markedCells])
                markedCells = []
            }
        })

        return objectsToRemove
    }

    clearObject(object) {
        object.destroy()
        setTimeout(() => { this.board[object.position[0]][object.position[1]].content = null }, 300) // Give time to play destruction animation of object
    }

    // Move all the pills down one row
    // Returns info if anything moved and all the pills that didn't
    doGravityStep() {
        var movedPills = []
        var stablePills = []
        for (var i = this.height - 1; i >= 0; i--) {
            this.board[i].forEach(cell => {
                if (cell.content) {
                    if (cell.content.pill) {
                        if (!movedPills.includes(cell.content.pill)) {
                            var pill = cell.content.pill
                            var result = this.movePill(pill, [1, 0])
                            if (result) {
                                movedPills.push(pill)
                            } else {
                                stablePills.push(pill)
                            }
                        }
                    }
                }
            })
        }
        return { wasAnythingMoved: movedPills.length > 0, stablePills: stablePills }
    }

    // Renders the board depending on the info in board array
    render() {
        var board = document.createElement("div")
        board.id = "board"
        this.board.forEach(row => {
            row.forEach(cell => {
                var tile = document.createElement("div")
                tile.classList.add("tile")
                if (cell.content) {
                    if (cell.content.sprite) {
                        tile.style.backgroundImage = cell.content.sprite
                    } else {
                        tile.style.backgroundColor = cell.content.color
                    }
                }
                board.appendChild(tile)
            })
        })
        document.getElementById("board").remove()
        document.getElementById("game_area").appendChild(board)
    }

    getRow(y) {
        return this.board[y]
    }

    getColumn(x) {
        var column = []
        this.board.forEach(row => {
            column.push(row[x])
        })
        return column
    }

    // Get random free position, reserved width and height restrict how far up/right can they be
    getRandomFreePosition(reservedHeight = 0, reservedWidth = 0) {
        var position = []
        do {
            var y = [Math.floor(reservedHeight + Math.random() * (this.height - reservedHeight))]
            var x = [Math.floor(reservedWidth + Math.random() * (this.width - reservedWidth))]
            position = [y, x]
        } while (this.board[position[0]][position[1]].content)
        return position
    }
}