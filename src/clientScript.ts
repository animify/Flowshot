import EventBus from './EventBus';

class FlowshotClient {
    constructor() {
        console.debug = console.debug.bind(null, '%c Flowshot Client:', 'font-weight: bold; color: #ffcc00');

        if (!window.FlowshotEvent) {
            window.FlowshotEvent = new EventBus();
            console.debug('Setting EventBus');
        }

        console.debug('Script injected');
        this.attachMessageListeners();
        this.attachClickListener();
    }

    attachMessageListeners() {
        window.FlowshotEvent.remove('flowshot-message.flowshot');
        window.FlowshotEvent.add('flowshot-message.flowshot', this.handleMessage.bind(this));
    }

    handleMessage(payload: any) {
        switch (true) {
            case payload.stopRecording:
                console.debug('Stopped recording')
                this.detachClickListener();
                break;
        }
    }

    detachClickListener() {
        window.FlowshotEvent.remove('click.flowshot', this.onClick);
    }

    attachClickListener() {
        this.detachClickListener();
        window.FlowshotEvent.add('click.flowshot', this.onClick);
    }


    onClick(e: MouseEvent) {
        console.debug('Click event - ', e);
        document.dispatchEvent(new CustomEvent('flowshot-message', {
            detail: {
                click: true,
                payload: {
                    type: e.type,
                    pageX: e.pageX,
                    pageY: e.pageY,
                    screenX: e.screenX,
                    screenY: e.screenY
                }
            }
        }));
    }
}

new FlowshotClient();