import { RecordingStatus } from "./types";

console.log = console.log.bind(null, '%c Flowshot Content:', 'font-weight: bold; color: #000');

class FlowshotContent {
    static listenToRequest() {
        console.log('Listening to runtime');

        chrome.runtime.onMessage.removeListener(FlowshotContent.handleRequest);
        chrome.runtime.onMessage.addListener(FlowshotContent.handleRequest);
    }

    static handleRequest(request: any, sender: chrome.runtime.MessageSender, respond: any) {
        console.log('Handling request', request);

        switch (true) {
            case request.changeRecordingState && request.recordingState === RecordingStatus.started:
                FlowshotContent.startRecording();
                break;
            case request.changeRecordingState && request.recordingState === RecordingStatus.stopped:
                FlowshotContent.stopRecording();
                break;
        }
    }

    static startRecording() {
        console.log('Starting recording');

        document.dispatchEvent(new CustomEvent('fs-request', {
            detail: { startRecording: true }
        }));

        document.removeEventListener('fs-request', FlowshotContent.handleMessage);
        document.addEventListener('fs-request', FlowshotContent.handleMessage);
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
        console.log('Stopping recording');
        document.dispatchEvent(new CustomEvent('fs-request', {
            detail: { stopRecording: true }
        }));
    }
}

FlowshotContent.listenToRequest();