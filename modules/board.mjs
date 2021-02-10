"use strict";

import { Pill } from "./pill.mjs"
import { PillPart } from "./pillPart.mjs";
import { Virus } from "./virus.mjs";
import { Cell } from "./cell.mjs";

export class Board {
    constructor(width, height) {
        this.width = width;
        this.height = height;
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
        return board
    }

    spawnPill(color) {
        var pill = new Pill(color)
        this.board[1][3].content = pill.parts[0]
        pill.parts[0].position = [1, 3]
        this.board[1][4].content = pill.parts[1]
        pill.parts[1].position = [1, 4]
        var isLosing = false
        if (this.board[2][3].content || this.board[2][4].content) {
            isLosing = true
        }
        return { pill: pill, isLosing: isLosing }
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
                this.board[pill.parts[1].position[0]][pill.parts[1].position[1]].content = null
                this.board[pill.parts[0].position[0]][pill.parts[0].position[1]].content = pill.parts[1]
                pill.parts[1].position[0] += 1
                pill.parts[0].position[1] += 1
                this.board[pill.parts[0].position[0]][pill.parts[0].position[1]].content = pill.parts[0]
                pill.parts.push(pill.parts.shift())
            } else if (this.board[pill.parts[0].position[0]][pill.parts[0].position[1] - 1].content == null && pill.parts[0].position[1] == this.width - 1) {
                pill.isHorizontal = true
                pill.parts[0].position[1] -= 1
                this.board[pill.parts[0].position[0]][pill.parts[0].position[1]].content = pill.parts[0]
                var movingPart = pill.parts[1]
                this.board[movingPart.position[0]][movingPart.position[1]].content = null
                movingPart.position[0] += 1
                this.board[movingPart.position[0]][movingPart.position[1]].content = movingPart
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
            } else if (this.board[pill.parts[0].position[0]][pill.parts[0].position[1] - 1].content == null && pill.parts[0].position[1] == this.width - 1) {
                pill.isHorizontal = true
                pill.parts[0].position[1] -= 1
                this.board[pill.parts[0].position[0]][pill.parts[0].position[1]].content = pill.parts[0]
                var movingPart = pill.parts[1]
                this.board[movingPart.position[0]][movingPart.position[1]].content = null
                movingPart.position[0] += 1
                this.board[movingPart.position[0]][movingPart.position[1]].content = movingPart
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
        this.board[object.position[0]][object.position[1]].content = null
        object.destroy()
    }

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
        return { areMovesPossible: movedPills.length > 0, stablePills: stablePills }
    }

    render() {
        var board = document.createElement("div")
        board.id = "board"
        this.board.forEach(row => {
            row.forEach(cell => {
                var tile = document.createElement("div")
                tile.classList.add("tile")
                if (cell.content) {
                    tile.style.backgroundColor = cell.content.color
                }
                board.appendChild(tile)
            })
        })
        document.getElementById("board").remove()
        document.body.appendChild(board)
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