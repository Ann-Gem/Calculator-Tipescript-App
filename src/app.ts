import { objEventBus } from "./pubsub.js";
import { AverageSection } from "./average-section.js";
import { FormCreator } from "./form-creator.js";
import { PublishData, StateItem } from "./interfaces";

type ResArr = (...args: number[]) => number;
type CalcProfAvg = (_state1: StateItem[], _state2: StateItem[]) => number[];

const container1: HTMLElement = document.getElementById("container1")!;
const container2: HTMLElement = document.getElementById("container2")!;

const st1: StateItem[] = [];
const st2: StateItem[] = [];

const formBuy = new FormCreator({ container: container1, state: st1 });
const formSell = new FormCreator({ container: container2, state: st2 });

const formAverage = new AverageSection();

objEventBus.subscribe("model_changed", changedModelEvent);
objEventBus.subscribe("price_changed", changedPriceEvent);

let state1: StateItem[] = formBuy.getState();
let state2: StateItem[] = formSell.getState();

let _curPrice1: number = 0;
let _wishPrice1: number = 0;
let _wishPrice2: number = 0;

let resArr: number[] = [];

function changedModelEvent(params: {
  container: HTMLElement;
  state: StateItem[];
}): void {
  if (params.container.id === "container1") {
    state1 = params.state;
  } else if (params.container.id === "container2") {
    state2 = params.state;
  }

  totalRecalculation();
}

function changedPriceEvent(params: PublishData): void {
  _curPrice1 = Number(params.curPrice1);
  _wishPrice1 = Number(params.wishPrice1);
  _wishPrice2 = Number(params.wishPrice2);

  totalRecalculation();
}

function totalRecalculation(): void {
  resArr = calculaterProfitAvg(state1, state2);
  countAmountShares(...resArr);
}

let calculaterProfitAvg: CalcProfAvg = (_state1, _state2) => {
  let statlong1: StateItem[] = createLongState(_state1);
  let statlong2: StateItem[] = createLongState(_state2);
  let arr_profit: StateItem[] = [];
  let profitl: number = 0;
  let avg: number = 0;

  if (statlong1.length > 0)
    statlong2 = getStateBeforeDateTime(statlong2, statlong1[0].id);
  let realcount = Number(Math.min(statlong1.length, statlong2.length));

  for (let k = 0; k < realcount; k++) {
    for (let h = statlong1.length - 1; h >= 0; h--) {
      if (statlong2[k].id >= statlong1[h].id) {
        let record1 = {
          id: statlong2[k].id,
          amount: 1,
          price: Number(statlong2[k].price) - Number(statlong1[h].price),
        };
        arr_profit.push(record1);
        profitl += Number(record1.price);
        statlong1 = statlong1.filter((n: StateItem) => {
          return n != statlong1[h];
        });

        break;
      }
    }
  }

  avg = calculateAverage(statlong1);
  formAverage.setCurProfit1(profitl);
  formAverage.setCurrentAveragePrice(avg);

  return [avg, statlong1.length, _wishPrice2, _wishPrice1];
};

let countAmountShares: ResArr = (avgPrice, amount, curP, wishP) => {
  let sharesToBuy: number = 0;

  if (avgPrice <= 0 || amount <= 0) {
    formAverage.setAveragePriceOfPos(0);
    formAverage.setCountOfShare1(0);
    sharesToBuy = 0;
  } else if (curP <= 0 || wishP <= 0) {
    formAverage.setCountOfShare1(0);
  } else {
    sharesToBuy = 0;
    formAverage.setAveragePriceOfPos(avgPrice);
    sharesToBuy = ((avgPrice - wishP) / (wishP - curP)) * amount;
    formAverage.setCountOfShare1(sharesToBuy);
  }
  return Number(sharesToBuy.toFixed(2));
};

function createLongState(_state: StateItem[]): StateItem[] {
  if (_state.length === 0) return [];
  let statenew = [];

  for (let i = 0; i < _state.length; i++) {
    let countnew: number = _state[i].amount;
    for (let j = 0; j < countnew; j++) {
      let record = {
        id: _state[i].id,
        amount: 1,
        price: _state[i].price,
      };
      statenew.push(record);
    }
  }
  return statenew;
}

function getStateBeforeDateTime(_state1: StateItem[], _datetime: number) {
  let statecorrect: StateItem[] = [];
  if (_state1.length > 0) {
    for (let i = 0; i < _state1.length; i++) {
      if (_state1[i].id >= _datetime) statecorrect.push(_state1[i]);
    }
  }
  console.log("statecorrect=");
  console.log(statecorrect);
  return statecorrect;
}

function calculateAverage(_state: StateItem[]): number {
  let count1: number = 0;
  let sum1: number = 0;
  let _avg: number = 0;
  if (_state.length < 0) return 0;

  for (let i = 0; i < _state.length; i++) {
    count1 += _state[i].amount;
    sum1 += _state[i].amount * _state[i].price;
  }
  if (count1 != 0) {
    _avg = sum1 / count1;
  }
  return Number(_avg.toFixed(2));
}
