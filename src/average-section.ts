import { objEventBus } from "./pubsub.js";
import { AverageSectionIF, StateItem } from "./interfaces";

export class AverageSection implements AverageSectionIF {
  _curPrice1 = 0;
  _wishPrice1 = 0;
  _wishPrice2 = 0;
  currentAveragePrice = 0;
  currentProfit = 0;
  averagePriceOfPos = <HTMLSpanElement>(
    document.getElementById("avg-price-of-pos")
  );
  curProfit1 = <HTMLDivElement>document.getElementById("cur-profit-1");
  countOfShare1 = <HTMLSpanElement>document.getElementById("shares");
  curPrice1 = <HTMLInputElement>document.getElementById("cur-price-1");
  wishPrice1 = <HTMLInputElement>document.getElementById("wish-price-1");
  wishPrice2 = <HTMLInputElement>document.getElementById("wish-price-2");

  constructor() {
    this.currentAveragePrice = 0;
    this.currentProfit = 0;
    this._curPrice1 = 0;
    this._wishPrice1 = 0;
    this._wishPrice2 = 0;
    this.initialize();
    this.initEventListeners();
  }

  getPubsubEvent(params: { container: HTMLElement; state: StateItem[] }): void {
    console.log(`container= ${params.container.id}`);
    console.log(`state= ${params.state}`);
    console.log(params.state);
  }

  initialize() {
    // Средняя цена позиции:
    this.averagePriceOfPos = <HTMLSpanElement>(
      document.getElementById("avg-price-of-pos")
    );
    // Текущий профит
    this.curProfit1 = <HTMLDivElement>document.getElementById("cur-profit-1")!;
    // Количество акций к покупке:
    this.countOfShare1 = <HTMLSpanElement>document.getElementById("shares")!;

    /// INPUTS ///
    // Текущая цена
    this.curPrice1 = <HTMLInputElement>document.getElementById("cur-price-1")!;
    // Желаемая средняя цена
    this.wishPrice1 = <HTMLInputElement>(
      document.getElementById("wish-price-1")!
    );
    // Текущая цена
    this.wishPrice2 = <HTMLInputElement>(
      document.getElementById("wish-price-2")!
    );
  }

  initEventListeners() {
    this.validateNumberInput(this.curPrice1);
    this.validateNumberInput(this.wishPrice1);
    this.validateNumberInput(this.wishPrice2);

    this.curPrice1.addEventListener("input", () => {
      this._curPrice1 = parseInt(this.curPrice1.value);
      this.publishModel(this._curPrice1, this._wishPrice1, this._wishPrice2);
    });

    this.wishPrice1.addEventListener("input", () => {
      this._wishPrice1 = parseInt(this.wishPrice1.value);
      this.publishModel(this._curPrice1, this._wishPrice1, this._wishPrice2);
    });

    this.wishPrice2.addEventListener("input", () => {
      this._wishPrice2 = parseInt(this.wishPrice2.value);
      this.publishModel(this._curPrice1, this._wishPrice1, this._wishPrice2);
    });
  }

  validateNumberInput(input_field: HTMLInputElement) {
    input_field.addEventListener(
      "keypress",
      function (e: KeyboardEvent) {
        var code = e.key;
        function keyAllowed() {
          let keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
          if (code && keys.indexOf(code) === -1) return false;
          else return true;
        }
        if (!keyAllowed()) e.preventDefault();
      },
      false
    );

    input_field.addEventListener(
      "paste",
      function (e: ClipboardEvent) {
        let pasteData = e.clipboardData?.getData("text/plain");
        if (pasteData?.match(/[^0-9]/)) e.preventDefault();
      },
      false
    );
  }

  publishModel(_curPrice1: number, _wishPrice1: number, _wishPrice2: number) {
    console.log("price_changed -событие!!");
    objEventBus.publish("price_changed", {
      curPrice1: _curPrice1,
      wishPrice1: _wishPrice1,
      wishPrice2: _wishPrice2,
    });
  }

  setCurrentAveragePrice(currentAveragePrice: number) {
    this.averagePriceOfPos.textContent = "+ " + currentAveragePrice.toString();
  }
  setAveragePriceOfPos(value: number) {
    this.averagePriceOfPos.innerText = value.toString();
  }

  setCurProfit1(value: number) {
    this.curProfit1.textContent = " " + value + " $";
  }

  // // Текущая цена//////////////////////////////////////////////////////////////////

  setCurPrice1(value: number) {
    this.curPrice1.value = String(value);
  }
  getCurPrice1() {
    return this._curPrice1;
  }
  // // Желаемая средняя цена/////////////////////////////////////////////////////////
  getWishPrice1() {
    return this._wishPrice1;
  }
  setWishPrice1(value: number) {
    this.wishPrice1.value = String(value);
  }
  // // Текущая цена//////////////////////////////////////////////////////////////////
  getWishPrice2() {
    return this._wishPrice2;
  }
  setWishPrice2(value: number) {
    this.wishPrice2.value = String(value);
  }
  // // Количество акций к покупке:////////////////////////////////////////////////////

  setCountOfShare1(value: number) {
    this.countOfShare1.textContent = String(value);
  }
}
