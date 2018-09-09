import { Utils } from "./Utils";
import { ChromeTabStatus, RecordingStatus } from "./types";

console.log = console.log.bind(null, '%c Flowshot Background:', 'font-weight: bold; color: #000');

interface Session {
    date: number;
    data: SessionData[];
}

interface SessionData {
    screen: {
        tab: string;
        date: number;
        dataURI: string;
        bounds: {
            w: number;
            h: number;
        }
    }
    click: {
        pageX: number;
        pageY: number;
        screenX: number;
        screenY: number;
    }
}

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

    static saveEvent(request: any) {
        FlowshotMain.captureCurrentTab().then((payload) => {
            FlowshotMain.sendToPopup('newImage', payload);

            const { pageX, pageY, screenX, screenY } = request;
            const sessionData: SessionData = {
                screen: payload,
                click: {
                    pageX,
                    pageY,
                    screenX,
                    screenY
                }
            };

            FlowshotMain.currentSession.data.push(sessionData);
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
                            date: Date.now(),
                            dataURI,
                            bounds: {
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
