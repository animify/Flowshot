import * as React from 'react';
import { Utils } from '../Utils';
import './style/stylekit.styl';
import { RecordingStatus } from '../types';

interface AppProps { }

interface AppState {
    recording: RecordingStatus;
    screenshots: Screenshot[];
}

interface Screenshot {
    title: string;
    date: number;
    dataURI: string;
    bounds: {
        h: number;
        w: number;
    }
}

const Description = ({ title, content }: { title: string, content: string }) => (
    <div className="ph6 pt2 text-left">
        <h2>{title}</h2>
        <p className="mb6">{content}</p>
    </div>
);

const Actions = ({ children }) => (
    <div className="pb5 ph6 flex flex-noshrink mtauto">
        {children}
    </div>
);

export default class Popup extends React.Component<AppProps, AppState> {
    state = {
        recording: RecordingStatus.stopped,
        screenshots: []
    }

    constructor(props: AppProps, state: AppState) {
        super(props, state);

        this.listen();
    }

    componentDidMount() {
        chrome.runtime.sendMessage({ popupMounted: true });
        chrome.storage.local.get(['recordingState'], (result) => {
            result.recordingState && this.setState({
                recording: result.recordingState as RecordingStatus
            });
        });
    }

    listen() {
        chrome.runtime.onMessage.addListener((request, sender, respond) => {
            switch (true) {
                case request.type === 'newImage':
                    this.setState((prevState) => ({
                        screenshots: [...prevState.screenshots, {
                            title: 'any',
                            date: Date.now(),
                            dataURI: request.payload.dataURI,
                            bounds: { ...request.payload.dimensions }
                        }]
                    }));
                    break;
            }
        });
    }


    setRecordingState = (status: RecordingStatus) => {
        Utils.getCurrentTab().then((tab) => {
            chrome.tabs.sendMessage(tab.id, {
                changeRecordingState: true,
                recordingState: status === RecordingStatus.started ? RecordingStatus.started : RecordingStatus.stopped
            });

            chrome.storage.local.set({ recordingState: status });
            chrome.runtime.sendMessage({ recordingState: status });

            this.setState({
                recording: status
            });
        });
    }

    PopupContent = ({ recordingState }: { recordingState: RecordingStatus }) => {
        switch (true) {
            case recordingState === RecordingStatus.started:
                return (<React.Fragment>
                    <Description
                        title="Recording..."
                        content="Your session is now being recorded. Clicks and websites visited are now tracked until the end of the session."
                    />
                    <Actions>
                        <a className="button red flex-grow" onClick={() => this.setRecordingState(RecordingStatus.discarded)}>Discard</a>
                        <a className="ml4 button black flex-grow" onClick={() => this.setRecordingState(RecordingStatus.stopped)}>Build your flow...</a>
                    </Actions>
                </React.Fragment>)
                break;
            case recordingState === RecordingStatus.stopped:
                return (<React.Fragment>
                    <Description
                        title="Let's get started."
                        content="Start off your session and continue browsing the web. When done, end your session and download your Overflow file."
                    />
                    <Actions>
                        <a className="button green flex-grow" onClick={() => this.setRecordingState(RecordingStatus.started)}>Begin new session</a>
                    </Actions>
                </React.Fragment>)
                break;
            case recordingState === RecordingStatus.discarded:
                return (<React.Fragment>
                    <Description
                        title="Session discarded."
                        content="The session has been discarded. Click &amp; website tracked has stopped until a new session has been initiated."
                    />
                    <Actions>
                        <a className="button green flex-grow" onClick={() => this.setRecordingState(RecordingStatus.started)}>Begin new session</a>
                    </Actions>
                </React.Fragment>)
                break;
        }
    }

    render() {
        const { screenshots, recording } = this.state;
        return (
            <React.Fragment>
                <header className="ph6 pt6">
                    <img height="20" src="js/Flowshot.svg" />
                </header>
                <this.PopupContent recordingState={recording} />
                {screenshots.map((s) => <img key={s.date} height={140} src={s.dataURI} />)}
            </React.Fragment>
        );
    };
}