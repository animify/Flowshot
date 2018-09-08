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

                            chrome.runtime.sendMessage({
                                type: 'newImage', payload: {
                                    title: 'any',
                                    date: Date.now(),
                                    dataURI,
                                    bounds: {
                                        h: fauxImage.height,
                                        w: fauxImage.width,
                                    }
                                }
                            });
                        }
                    }
                });
            break;
        default:
            console.log('Background Request - ', request);
            break;
    }

    return isResponseAsync;
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    window.console.log('updated from background', changeInfo);
    if (changeInfo.status === 'complete') {
        chrome.tabs.executeScript(tabId, { file: 'js/clientScript.js' });
    }
});