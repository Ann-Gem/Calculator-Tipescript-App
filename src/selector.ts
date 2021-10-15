const selected = document.querySelector(".selected") as HTMLElement;
const optionsContainer = document.querySelector(
  ".options-container"
) as HTMLElement;
const optionsList = document.querySelectorAll(".option") as NodeListOf<Element>;
selected.addEventListener("click", function () {
  optionsContainer!.classList.toggle("active");
});
optionsList.forEach(function (option: Element) {
  option.addEventListener("click", function (): void {
    selected.innerHTML = option.querySelector("label")!.innerHTML;
    optionsContainer.classList.remove("active");
  });
});
