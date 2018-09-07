console.log = console.log.bind(null, '%c Flowshot:', 'font-weight: bold; color: #000');

// Listen to messages sent from other parts of the extension.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // onMessage must return "true" if response is async.
    let isResponseAsync = false;

    switch (true) {
        case request.popupMounted:
            console.log('Extension mounted');
            break;
        case request.capture:
            console.log('Capturing page');
            break;
        case request.click:
            const payload = request.payload;
            console.log('Got payload', payload)
            chrome.tabs.captureVisibleTab(null,
                { format: 'png', quality: 100 }, (dataURI) => {
                    if (dataURI) {
                        const fauxImage = new Image();
                        fauxImage.src = dataURI;
                        fauxImage.onload = () => {
                            console.log('Built image', fauxImage);
                        }
                    }
                });
            break;
        default:
            console.log('Background request - ', request);
            break;
    }

    return isResponseAsync;
});