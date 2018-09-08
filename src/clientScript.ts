class FlowshotClient {
    constructor() {
        console.log('Flowshot Client:', 'Client Script injected.')
        this.attachMessageListeners();
        this.attachClickListener();
    }

    attachMessageListeners() {
        document.addEventListener('flowshot-message', (event: CustomEvent) => {
            switch (true) {
                case event.detail.stopRecording:
                    console.log('stopped recording')
                    this.detachClickListener();
                    break;
            }
        });
    }

    detachClickListener() {
        document.body.removeEventListener('click', this.onClick);
    }

    attachClickListener() {
        this.detachClickListener();
        document.body.addEventListener('click', this.onClick);
    }

    onClick(e: MouseEvent) {
        console.log('onclick', e);
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