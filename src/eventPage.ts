import { Utils } from './Utils';
import { ChromeTabStatus, RecordingStatus, Session, SessionData } from './types';
import FileManager from './FileManager';

console.log = console.log.bind(null, '%c Flowshot Background:', 'font-weight: bold; color: #000');

class FlowshotMain {
    public static currentSession: Session;

    private static get baseSession(): Session {
        return {
            date: Date.now(),
            data: []
        }
    }

    private static newSession() {
        console.log('Session created');
        FlowshotMain.currentSession = FlowshotMain.baseSession;
    }

    private static endSession() {
        console.log('Session ended');
        console.log(FlowshotMain.currentSession);
        FlowshotMain.saveEvent(null);
        FlowshotMain.saveSession();
    }

    private static saveSession() {
        FileManager.zipFiles(FlowshotMain.currentSession.data);
    }

    public static handleSessionChange(state: RecordingStatus) {
        console.log('Handling session change')
        switch (true) {
            case state === RecordingStatus.started:
                FlowshotMain.newSession();
                break;
            case state === RecordingStatus.stopped:
                FlowshotMain.endSession();
                break;
        }
    }

    static saveEvent(clickEvent: SessionData['click']) {
        FlowshotMain.captureCurrentTab().then((payload) => {
            const sessionData: SessionData = {
                date: Date.now(),
                screen: payload,
                click: clickEvent
            };

            FlowshotMain.currentSession.data.push(sessionData);
            FlowshotMain.sendToPopup('newImage', payload);
        });
    }

    static sendToPopup(type: string, payload: any) {
        chrome.runtime.sendMessage({ type, payload });
    }

    private static captureCurrentTab(): Promise<SessionData['screen']> {
        return new Promise((resolve => {
            chrome.tabs.captureVisibleTab(null, { format: 'png', quality: 100 }, (dataURI) => {
                if (!dataURI) return;

                const fauxImage = new Image();
                fauxImage.src = dataURI;
                fauxImage.onload = () => {
                    Utils.getCurrentTab().then((tab) => {
                        resolve({
                            tab: tab.title,
                            dataURI,
                            dimensions: {
                                h: fauxImage.height,
                                w: fauxImage.width,
                            }
                        })
                    });
                };
            });
        }))
    }
}

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
            FlowshotMain.saveEvent(request.payload);
            break;
        case request.recordingState !== undefined:
            FlowshotMain.handleSessionChange(request.recordingState);
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
