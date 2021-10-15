export class ClassEventBus {
    channels = {};
    subscribe(channelName, listener) {
        if (!this.channels[channelName]) {
            this.channels[channelName] = [];
        }
        this.channels[channelName].push(listener);
    }
    publish(channelName, data) {
        const channel = this.channels[channelName];
        if (!channel || !channel.length) {
            return;
        }
        channel.forEach((listener) => listener(data));
    }
}
export let objEventBus = new ClassEventBus();
