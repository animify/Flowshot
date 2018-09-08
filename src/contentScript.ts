console.log = console.log.bind(null, '%c Flowshot Content:', 'font-weight: bold; color: #000');

class FlowshotContent {
    static listenToRequest() {
        console.log('Listening to runtime')
        chrome.runtime.onMessage.removeListener(FlowshotContent.handleRequest);
        chrome.runtime.onMessage.addListener(FlowshotContent.handleRequest);
    }

    static handleRequest(request: any, sender: chrome.runtime.MessageSender, respond: any) {
        console.log('Handling request', request)
        switch (true) {
            case request.record:
                FlowshotContent.listenToMessage();
                break;
            case request.stopRecord:
                FlowshotContent.stopRecording();
                break;
            default:
                console.log('Content Script Request - ', request);
                break;
        }
    }

    static listenToMessage() {
        console.log('Listening to message');
        document.removeEventListener('flowshot-message', FlowshotContent.handleMessage);
        document.addEventListener('flowshot-message', FlowshotContent.handleMessage);
    }

    static handleMessage(event: CustomEvent) {
        console.log('Handling message', event)
        switch (true) {
            case event.detail.click:
                FlowshotContent.sendToBackground(event.detail);
                break;
        }
    }

    static sendToBackground(payload: any) {
        chrome.runtime.sendMessage(payload);
    }

    static stopRecording() {
        document.dispatchEvent(new CustomEvent('flowshot-message', {
            detail: { stopRecording: true }
        }));
    }
}

FlowshotContent.listenToRequest();