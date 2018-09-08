import EventBus from './EventBus';

class FlowshotClient {
    constructor() {
        if (!window.FlowshotEvents) {
            console.debug = console.debug.bind(null, '%c Flowshot Client:', 'font-weight: bold; color: #ffcc00');
            window.FlowshotEvents = new EventBus();
            console.debug('Set EventBus');
        }

        console.debug('Script injected');
        this.attachMessageListeners();
    }

    attachMessageListeners() {
        window.FlowshotEvents.remove('fs-request.flowshot');
        window.FlowshotEvents.add('fs-request.flowshot', (event: CustomEvent) => this.handleMessage(event.detail));
    }

    handleMessage(payload: any) {
        console.log('Got payload', payload);

        switch (true) {
            case payload.startRecording:
                console.debug('Started recording');
                this.attachClickListener();
                break;
            case payload.stopRecording:
                console.debug('Stopped recording');
                this.detachClickListener();
                break;
        }
    }

    detachClickListener() {
        window.FlowshotEvents.remove('click.flowshot');
    }

    attachClickListener() {
        this.detachClickListener();
        window.FlowshotEvents.add('click.flowshot', this.onClick);
    }

    onClick(e: MouseEvent) {
        console.debug('Click event - ', e);
        document.dispatchEvent(new CustomEvent('fs-request', {
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