import { Utils } from "./Utils";
import { ChromeTabStatus } from "./types";

console.log = console.log.bind(null, '%c Flowshot Background:', 'font-weight: bold; color: #000');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Handling request - ', request);

    switch (true) {
        case request.popupMounted:
            console.log('Extension mounted');
            break;
        case request.capture:
            console.log('Capturing page');
            break;
        case request.click:
            chrome.tabs.captureVisibleTab(null, { format: 'png', quality: 100 }, (dataURI) => {
                if (!dataURI) return;
                const fauxImage = new Image();
                fauxImage.src = dataURI;
                fauxImage.onload = () => {
                    console.log('Built image');
                    Utils.getCurrentTab().then((tab) => {
                        chrome.runtime.sendMessage({
                            type: 'newImage', payload: {
                                title: 'any',
                                tab: tab.title,
                                date: Date.now(),
                                dataURI,
                                bounds: {
                                    h: fauxImage.height,
                                    w: fauxImage.width,
                                }
                            }
                        });
                    });
                };
            });
            break;
    }

    return true;
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log('Tabs updating', tabId, changeInfo);

    if (changeInfo.status === ChromeTabStatus.complete) {
        console.log('Injecting script into', tab.title);
        Utils.executeScript(tabId, { file: 'js/clientScript.js' });
    }
});
