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
            this.setState({
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
                            bounds: {
                                h: request.payload.height,
                                w: request.payload.width,
                            }
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

            this.setState({
                recording: status
            });
        });
    }

    render() {
        const { screenshots, recording } = this.state;
        const isRecording = recording === RecordingStatus.started;
        return (
            <React.Fragment>
                <header className="ph6 pt6">
                    <img height="20" src="js/Flowshot.svg" />
                </header>
                <div className="ph6 pt2 text-left">
                    {isRecording ?
                        <React.Fragment>
                            <h2>Recording...</h2>
                            <p className="mb6">Your session is now being recorded and your clicks are being tracked.</p>
                        </React.Fragment>
                        :
                        <React.Fragment>
                            <h2>Let's get started</h2>
                            <p className="mb6">Start off your session and start keep browsing the web. When done, end your session and download your Overflow file.</p>
                        </React.Fragment>
                    }
                </div>

                <div className="pb5 ph6 flex flex-noshrink mtauto">
                    {isRecording ?
                        <React.Fragment>
                            <a className="button black flex-grow" onClick={() => this.setRecordingState(RecordingStatus.discarded)}>Discard</a>
                            <a className="ml4 button red flex-grow" onClick={() => this.setRecordingState(RecordingStatus.stopped)}>Stop &amp; Save...</a>
                        </React.Fragment>
                        :
                        <React.Fragment>
                            <a className="button green flex-grow" onClick={() => this.setRecordingState(RecordingStatus.started)}>Start Session</a>
                        </React.Fragment>
                    }
                </div>

                {screenshots.map((s) => <img key={s.date} height={140} src={s.dataURI} />)}
            </React.Fragment>
        );
    };
}
