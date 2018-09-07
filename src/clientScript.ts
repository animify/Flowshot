class FlowshotClient {
    constructor() {
        console.log('Flowshot Client:', 'Client Script injected.')
        this.attachClickListener();
    }

    attachClickListener() {
        document.body.removeEventListener('click', this.onClick);
        document.body.addEventListener('click', this.onClick);
    }

    onClick(e: MouseEvent) {
        console.log('onclick', e);
        document.dispatchEvent(new CustomEvent('flowshot-client-message', {
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