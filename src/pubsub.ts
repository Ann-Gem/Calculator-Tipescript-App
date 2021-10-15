import { EventBus } from "./interfaces";
import { PublishData } from "./interfaces";

export class ClassEventBus implements EventBus {
  channels: {
    [channelName: string]: Function[];
  } = {};

  subscribe(channelName: string, listener: Function): void {
    if (!this.channels[channelName]) {
      this.channels[channelName] = [];
    }
    this.channels[channelName].push(listener);
  }
  publish(channelName: string, data: PublishData): void {
    const channel = this.channels[channelName];
    if (!channel || !channel.length) {
      return;
    }
    channel.forEach((listener: any) => listener(data));
  }
}

export let objEventBus = new ClassEventBus();
