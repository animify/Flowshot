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
            <div className="p6">
                <div className="text-center">
                    <h4 className="mb1">{isRecording ? 'Recording...' : 'Begin your session'}</h4>
                    <p className="mb4">Start recording and keep browsing the web like you'd normally do. Once you think you're done, stop the recording and download your Overflow file.</p>
                    {isRecording ?
                        <React.Fragment>
                            <a className="button" onClick={() => this.setRecordingState(RecordingStatus.discarded)}>Discard Recording</a>
                            <a className="ml4 button red" onClick={() => this.setRecordingState(RecordingStatus.stopped)}>Stop Recording</a>
                        </React.Fragment>
                        :
                        <React.Fragment>
                            <a className="button green" onClick={() => this.setRecordingState(RecordingStatus.started)}>Start Recording</a>
                        </React.Fragment>
                    }
                </div>
                {screenshots.map((s) => <img key={s.date} height={140} src={s.dataURI} />)}
            </div>
        );
    };
}
