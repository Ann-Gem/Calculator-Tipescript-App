"use strict";
const selected = document.querySelector(".selected");
const optionsContainer = document.querySelector(".options-container");
const optionsList = document.querySelectorAll(".option");
selected.addEventListener("click", function () {
    optionsContainer.classList.toggle("active");
});
optionsList.forEach(function (option) {
    option.addEventListener("click", function () {
        selected.innerHTML = option.querySelector("label").innerHTML;
        optionsContainer.classList.remove("active");
    });
});
