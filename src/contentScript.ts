chrome.runtime.onMessage.addListener((request, sender, respond) => {
    switch (true) {
        case request.record:
            document.addEventListener('flowshot-message', (event: CustomEvent) => {
                console.log('got event', event);
                chrome.runtime.sendMessage(event.detail);
            });
            break;
        case request.stopRecord:
            document.dispatchEvent(new CustomEvent('flowshot-message', {
                detail: { stopRecording: true }
            }));
            break;
        default:
            console.log('Content Script Request - ', request);
            break;
    }
});