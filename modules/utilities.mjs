"use strict";

// Class containing utility functions that can be used in multiple parts of the game. 
// It should only contain static methods.
export class Utilities {

    // Converts string of numbers to images showing them. Returns div containing img elements.
    static convertNumericStringToImage(string) {
        var image = document.createElement("div")
        image.classList.add("numeric_display")
        string.split("").forEach(digit => {
            var digitImage = document.createElement("img")
            digitImage.src = `../images/digits/${digit}.png`
            image.appendChild(digitImage)
        });
        return image
    }
}