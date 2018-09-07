// Listen to messages sent from other parts of the extension.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // onMessage must return "true" if response is async.
    let isResponseAsync = false;

    console.log(request);

    switch (true) {
        case request.popupMounted:
            console.log('Extension has been mounted.');
            break;
        case request.capture:
            console.log('Capturing page.');
            break;
    }

    return isResponseAsync;
});
