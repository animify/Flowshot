chrome.runtime.onMessage.addListener((request, sender, response) => {
    console.log('from content script', request);
});