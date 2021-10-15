interface FormCreatorIF {
  amount: number | string;
  price: number | string;
  container: HTMLElement;
  currentAveragePrice: any;
  plus: HTMLButtonElement;
  minus: HTMLButtonElement;
  addBtn: HTMLButtonElement;
  inputAmount: HTMLInputElement;
  inputPrice: HTMLInputElement;
  divTable: HTMLElement;
  divList: HTMLCollectionOf<Element>;
  divList1: HTMLCollectionOf<Element>;
  params: {
    container: HTMLElement;
    state: StateItem[];
  };
}

interface StateItem {
  id: number;
  amount: number;
  price: number;
  sum?: number;
}
interface AverageSectionIF {
  currentAveragePrice: number;
  currentProfit: number;
  _curPrice1: number;
  _wishPrice1: number;
  _wishPrice2: number;
  averagePriceOfPos: HTMLSpanElement;
  curProfit1: HTMLElement;
  countOfShare1: HTMLElement;
  curPrice1: HTMLInputElement;
  wishPrice1: HTMLInputElement;
  wishPrice2: HTMLInputElement;
}

interface EventBus {
  subscribe(channelName: string, listener: Function): void;
  publish(channelName: string, data: any): void;
}

interface PublishData {
  container?: HTMLElement;
  state?: StateItem[];
  curPrice1?: number;
  wishPrice1?: number;
  wishPrice2?: number;
}

export { EventBus, AverageSectionIF, StateItem, FormCreatorIF, PublishData };
