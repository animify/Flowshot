import * as React from 'react';
import { Utils } from '../Utils';
import './style/stylekit.styl';

interface AppProps { }

interface AppState {
    recording: boolean;
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
        recording: false,
        screenshots: []
    }

    constructor(props: AppProps, state: AppState) {
        super(props, state);

        this.listen();
    }

    componentDidMount() {
        chrome.runtime.sendMessage({ popupMounted: true });
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

    startRecording = () => {
        Utils.getCurrentTab().then((tabId) => {
            chrome.tabs.sendMessage(tabId, { record: true });

            this.setState({
                recording: true
            });
        });
    }

    stopRecording = () => {
        Utils.getCurrentTab().then((tabId) => {
            chrome.tabs.sendMessage(tabId, { stopRecord: true });

            this.setState({
                recording: false
            });
        });
    }

    discardRecording = () => {
        Utils.getCurrentTab().then((tabId) => {
            chrome.tabs.sendMessage(tabId, { discardRecording: true });

            this.setState({
                recording: false
            });
        });
    }

    render() {
        const { screenshots, recording } = this.state;
        console.log(screenshots);

        return (
            <div className="p6">
                <div className="text-center">
                    <h4 className="mb1">{recording ? 'Recording...' : 'Begin your session'}</h4>
                    <p className="mb4">Hit 'Start Recording' and keep browsing the web like you'd normally do. Once you think you're done, stop the recording and download your Overflow file.</p>
                    {recording ?
                        <React.Fragment>
                            <a onClick={this.discardRecording} className="button">Discard Recording</a>
                            <a onClick={this.stopRecording} className="ml4 button red">Stop Recording</a>
                        </React.Fragment>
                        :
                        <React.Fragment>
                            <a onClick={this.startRecording} className="button green">Start Recording</a>
                        </React.Fragment>
                    }
                </div>
                {screenshots.map(s => <img height={s.bounds.h / 4} width={s.bounds.w / 4} src={s.dataURI} />)}
            </div>
        )
    }
}
