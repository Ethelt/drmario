"use strict";

export class Utilities {
    static convertStringToImage(string) {
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