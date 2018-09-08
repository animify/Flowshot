export class Helpers {
    static sendToCurrentTab(message: any, callback: (response: any) => void) {
        chrome.tabs.query({
            active: true,
            currentWindow: true,
        }, (tabs) => {
            chrome.tabs.sendMessage(
                tabs[0].id,
                message,
                callback
            );
        });
    }
    static executeOnCurrentTab(message: any, callback: (response: any) => void) {
        chrome.tabs.query({
            active: true,
            currentWindow: true,
        }, (tabs) => {
            chrome.tabs.sendMessage(
                tabs[0].id,
                message,
                callback
            );
        });
    }
}