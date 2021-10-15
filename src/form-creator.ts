import { objEventBus } from "./pubsub.js";
import { StateItem } from "./interfaces";
import { FormCreatorIF } from "./interfaces";

export class FormCreator implements FormCreatorIF {
  amount = 0;
  state: StateItem[] = [];
  price = 0;
  container = document.getElementById("container1")!;
  currentAveragePrice = 0;
  plus = document.createElement("button");
  minus = document.createElement("button");
  addBtn = document.createElement("button");
  inputAmount = document.createElement("input");
  inputPrice = document.createElement("input");
  divTable = document.createElement("div");

  divList = document.getElementsByClassName(
    "container-content"
  ) as HTMLCollectionOf<Element>;
  divList1 = document.getElementsByClassName(
    "container-content-items"
  ) as HTMLCollectionOf<Element>;

  params: {
    container: HTMLElement;
    state: StateItem[];
  };

  constructor(params: { container: HTMLElement; state: StateItem[] }) {
    this.container = params.container;
    this.state = params.state;
    this.params = params;
    this.amount = 0;
    this.price = 0;
    this.initialize();
    this.initEventListeners();
  }

  setCurrentAveragePrice(currentAveragePrice: number): void {
    this.currentAveragePrice = currentAveragePrice;
  }
  initialize(): void {
    this.plus = <HTMLButtonElement>(
      this.container.getElementsByClassName("plus")[0]
    );
    this.minus = <HTMLButtonElement>(
      this.container.getElementsByClassName("minus")[0]
    );
    this.addBtn = <HTMLButtonElement>(
      this.container.getElementsByClassName("add")[0]
    );
    this.inputAmount = <HTMLInputElement>(
      this.container.getElementsByClassName("counter-units")[0]
    );
    this.inputPrice = <HTMLInputElement>(
      this.container.getElementsByClassName("unit-price")[0]
    );
    this.divTable = <HTMLDivElement>(
      this.container.getElementsByClassName("container-content")[0]
    );
    this.divList = <HTMLCollection>(
      this.container
        .getElementsByClassName("container-content")[0]
        .getElementsByClassName("container-content-items")
    );
    this.divList1 = <HTMLCollection>(
      this.container.getElementsByClassName("container-content-items")
    );
  }

  publishModel(_container: HTMLElement, _state: StateItem[]) {
    console.log("Model-saved123");
    objEventBus.publish("model_changed", {
      container: _container,
      state: _state,
    });
  }

  getState(): StateItem[] {
    return this.state;
  }

  initEventListeners(): void {
    this.plus.addEventListener("click", () => {
      this.amount = parseInt(this.changingCount("plus", this.inputAmount));
    });
    this.minus.addEventListener("click", () => {
      this.amount = parseInt(this.changingCount("minus", this.inputAmount));
    });
    this.inputPrice.addEventListener("input", () => {
      this.validateForm(
        this.inputPrice.value,
        this.inputAmount.value,
        this.addBtn
      );
      this.price = parseInt(this.inputPrice.value);
    });
    this.inputAmount.addEventListener("input", () => {
      this.validateForm(
        this.inputPrice.value,
        this.inputAmount.value,
        this.addBtn
      );
      this.amount = parseInt(this.inputAmount.value);
    });
    this.addBtn.addEventListener("click", (event: MouseEvent) => {
      event.preventDefault();
      this.price = parseInt(this.inputPrice.value);
      this.amount = parseInt(this.inputAmount.value);
      this.clearInputs(this.inputAmount, this.inputPrice, this.addBtn);

      if (this.amount > 0 && this.price > 0) {
        this.modelAddRecord(this.amount, this.price);
      }
    });
    this.divTable.addEventListener("click", (event: MouseEvent) => {
      event.preventDefault();
      if ((event.target as HTMLButtonElement).className === "del") {
        let id: number = parseInt(
          (event.target as HTMLButtonElement).parentElement!.id
        );
        this.modelDeleteRecord(id);
      }
    });
  }
  validateForm(val1: string, val2: string, element: HTMLButtonElement) {
    if (parseInt(val1) <= 0 || parseInt(val2) <= 0) {
      val1 = "0";
      val2 = "0";
      element.setAttribute("disabled", "true");
    } else {
      element.removeAttribute("disabled");
    }
    return parseInt(val1);
  }
  modelAddRecord(amount1: number, price1: number) {
    let _record = {
      id: Number(Date.now()),
      amount: amount1,
      price: price1,
      sum: amount1 * price1,
    };
    this.state.push(_record);

    this.addTableRow(_record.id, _record.amount, _record.price, _record.sum);
    this.publishModel(this.container, this.state);
  }

  modelDeleteRecord(id: number) {
    this.state = this.state.filter((n: StateItem) => {
      return n.id != id;
    });
    this.deleteTableRow(id);
    this.publishModel(this.container, this.state);
  }

  addTableRow(id: number, amount: number, price: number, sum: number) {
    if (
      this.state.length > 0 &&
      this.container.getElementsByClassName("no-recording").length > 0
    ) {
      this.container.getElementsByClassName("no-recording")[0].remove();
    }
    let recr: HTMLDivElement = document.createElement("div");
    recr.classList.add("container-content-items");
    recr.id = String(id);
    let recordAmount: HTMLDivElement = document.createElement("div");
    recordAmount.classList.add("item", "count");
    recordAmount.insertAdjacentHTML("afterbegin", `<span>${amount}</span>`);
    let recordPrice: HTMLDivElement = document.createElement("div");
    recordPrice.classList.add("item", "price", "currency");
    recordPrice.insertAdjacentHTML("afterbegin", `<span>${price}</span>`);
    let stateSum: HTMLDivElement = document.createElement("div");
    stateSum.classList.add("item", "sum", "currency");
    stateSum.insertAdjacentHTML("afterbegin", `<span>${sum}</span>`);
    let del: HTMLDivElement = document.createElement("div");
    del.classList.add("btn-del");
    let delBtn: HTMLButtonElement = document.createElement("button");
    delBtn.classList.add("del");
    delBtn.insertAdjacentElement("afterbegin", del);
    recr.insertAdjacentElement("beforeend", recordAmount);
    recr.insertAdjacentElement("beforeend", recordPrice);
    recr.insertAdjacentElement("beforeend", stateSum);
    recr.insertAdjacentElement("beforeend", delBtn);
    this.divTable.appendChild(recr);
  }
  deleteTableRow(id: number) {
    for (let i = 0; i < this.divList.length; i++) {
      if (parseInt(this.divList[i].id) == id) {
        this.divList[i].remove();
      }
    }
    if (
      this.divList.length === 0 &&
      this.container.getElementsByClassName("no-recording").length === 0
    ) {
      let div: HTMLDivElement = document.createElement("div");
      div.className = "no-recording";
      div.innerHTML = "Нет записей";
      this.divTable.insertAdjacentElement("beforeend", div);
    }
  }

  changingCount(sign: string, element: HTMLInputElement) {
    if (!element.value) element.valueAsNumber = 0;
    if (sign == "plus") element.valueAsNumber = element.valueAsNumber + 1;
    else if (parseInt(element.value) > 0)
      element.value = String(parseInt(element.value) - 1);
    return element.value;
  }
  clearInputs(
    inputAmount: HTMLInputElement,
    inputPrice: HTMLInputElement,
    addBtn: HTMLButtonElement
  ) {
    inputAmount.value = "";
    inputPrice.value = "";
    addBtn.setAttribute("disabled", "true");
  }

  checkClearTable() {
    this.divList1 = this.container.getElementsByClassName(
      "container-content-items"
    ) as HTMLCollectionOf<Element>;

    if (
      this.divList.length === 0 &&
      this.container.getElementsByClassName("no-recording").length === 0
    ) {
      for (let i = 0; i < this.divList.length; i++) this.divList[i].remove();

      let div: HTMLDivElement = document.createElement("div");
      div.className = "no-recording";
      div.innerHTML = "Нет записей";
      this.divTable.insertAdjacentElement("beforeend", div);
    }
  }

  getAmount() {
    return this.inputAmount.value;
  }
  setAmount(amount1: number) {
    this.inputAmount.value = String(amount1);
  }
  getPrice() {
    return this.inputPrice.value;
  }
  setPrice(price1: number) {
    this.inputPrice.value = String(price1);
  }
  clearTable() {
    this.divTable = this.container.getElementsByClassName(
      "container-content"
    )[0] as HTMLDivElement;
    let divList1: HTMLCollectionOf<Element> =
      this.container.getElementsByClassName("container-content-items");
    for (let i = 0; i < divList1.length; i++) divList1[i].remove();
  }
  displaystate() {
    this.clearTable();
    if (this.state.length > 0) {
      if (this.container.getElementsByClassName("no-recording").length > 0) {
        this.container.getElementsByClassName("no-recording")[0].remove();
      }
      this.state.sort((a: StateItem, b: StateItem) => a.id - b.id);
      console.log(this.state);
      for (let it = 0; it < this.state.length; it++) {
        let recr: HTMLDivElement = document.createElement("div");
        recr.classList.add("container-content-items");
        recr.id = String(Date.now());
        let recordAmount: HTMLDivElement = document.createElement("div");
        recordAmount.classList.add("item", "count");
        recordAmount.insertAdjacentHTML(
          "afterbegin",
          `<span>${this.state[it].amount}</span>`
        );
        let recordPrice: HTMLDivElement = document.createElement("div");
        recordPrice.classList.add("item", "price", "currency");
        recordPrice.insertAdjacentHTML(
          "afterbegin",
          `<span>${this.state[it].price}</span>`
        );
        let stateSum: HTMLDivElement = document.createElement("div");
        stateSum.classList.add("item", "sum", "currency");
        stateSum.insertAdjacentHTML(
          "afterbegin",
          `<span>${this.state[it].amount * this.state[it].price}</span>`
        );
        let del: HTMLDivElement = document.createElement("div");
        del.classList.add("btn-del");
        let delBtn: HTMLButtonElement = document.createElement("button");
        delBtn.classList.add("del");
        delBtn.insertAdjacentElement("afterbegin", del);
        /// добавление
        recr.insertAdjacentElement("beforeend", recordAmount);
        recr.insertAdjacentElement("beforeend", recordPrice);
        recr.insertAdjacentElement("beforeend", stateSum);
        recr.insertAdjacentElement("beforeend", delBtn);
        this.divTable.appendChild(recr);
      }
    }
  }

  getFormInfo() {
    return {
      plus: this.plus,
      minus: this.minus,
      inputAmount: this.inputAmount,
      inputPrice: this.inputPrice,
      divTable: this.divTable,
      addBtn: this.addBtn,
      fstate: this.state,
    };
  }
}
