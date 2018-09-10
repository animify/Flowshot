export class Utils {
    static getCurrentTab(): Promise<chrome.tabs.Tab> {
        return new Promise((resolve) => {
            chrome.tabs.query({
                active: true,
                currentWindow: true,
            }, (tabs) => {
                return resolve(tabs[0]);
            });
        });
    }

    static sendMessage(tabId: number, message: any, callback: (response: any) => void) {
        chrome.tabs.sendMessage(
            tabId,
            message,
            callback
        );
    }

    static executeScript(tabId: number, details: chrome.tabs.InjectDetails) {
        chrome.tabs.executeScript(tabId, details);
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

    public static newGUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
}