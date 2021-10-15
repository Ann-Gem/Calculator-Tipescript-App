import { objEventBus } from './pubsub.js';
export class AverageSection {
    _curPrice1 = 0;
    _wishPrice1 = 0;
    _wishPrice2 = 0;
    currentAveragePrice = 0;
    currentProfit = 0;
    averagePriceOfPos = document.getElementById("avg-price-of-pos");
    curProfit1 = document.getElementById("cur-profit-1");
    countOfShare1 = document.getElementById("shares");
    curPrice1 = document.getElementById("cur-price-1");
    wishPrice1 = document.getElementById("wish-price-1");
    wishPrice2 = document.getElementById("wish-price-2");
    constructor() {
        this.currentAveragePrice = 0;
        this.currentProfit = 0;
        this._curPrice1 = 0;
        this._wishPrice1 = 0;
        this._wishPrice2 = 0;
        this.initialize();
        this.initEventListeners();
    }
    getPubsubEvent(params) {
        console.log(`container= ${params.container.id}`);
        console.log(`state= ${params.state}`);
        console.log(params.state);
    }
    initialize() {
        this.averagePriceOfPos = document.getElementById("avg-price-of-pos");
        this.curProfit1 = document.getElementById("cur-profit-1");
        this.countOfShare1 = document.getElementById("shares");
        this.curPrice1 = document.getElementById("cur-price-1");
        this.wishPrice1 = document.getElementById("wish-price-1");
        this.wishPrice2 = document.getElementById("wish-price-2");
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
    validateNumberInput(input_field) {
        input_field.addEventListener("keypress", function (e) {
            var code = e.key;
            function keyAllowed() {
                let keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
                if (code && keys.indexOf(code) === -1)
                    return false;
                else
                    return true;
            }
            if (!keyAllowed())
                e.preventDefault();
        }, false);
        input_field.addEventListener("paste", function (e) {
            let pasteData = e.clipboardData?.getData("text/plain");
            if (pasteData?.match(/[^0-9]/))
                e.preventDefault();
        }, false);
    }
    publishModel(_curPrice1, _wishPrice1, _wishPrice2) {
        console.log("price_changed -событие!!");
        objEventBus.publish("price_changed", {
            curPrice1: _curPrice1,
            wishPrice1: _wishPrice1,
            wishPrice2: _wishPrice2,
        });
    }
    setCurrentAveragePrice(currentAveragePrice) {
        this.averagePriceOfPos.textContent = "+ " + currentAveragePrice.toString();
    }
    setAveragePriceOfPos(value) {
        this.averagePriceOfPos.innerText = value.toString();
    }
    setCurProfit1(value) {
        this.curProfit1.textContent = " " + value + " $";
    }
    setCurPrice1(value) {
        this.curPrice1.value = String(value);
    }
    getCurPrice1() {
        return this._curPrice1;
    }
    getWishPrice1() {
        return this._wishPrice1;
    }
    setWishPrice1(value) {
        this.wishPrice1.value = String(value);
    }
    getWishPrice2() {
        return this._wishPrice2;
    }
    setWishPrice2(value) {
        this.wishPrice2.value = String(value);
    }
    setCountOfShare1(value) {
        this.countOfShare1.textContent = String(value);
    }
}
