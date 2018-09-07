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
    }
}

new FlowshotClient();