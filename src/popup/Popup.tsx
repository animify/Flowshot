import * as React from 'react';
import './Popup.scss';
import { Utils } from '../Utils';

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

    record = () => {
        const willRecord = !this.state.recording;

        if (willRecord) {
            Utils.getCurrentTab().then((tabId) => {
                chrome.tabs.sendMessage(tabId, { record: true });
            });
        } else {
            Utils.getCurrentTab().then((tabId) => {
                chrome.tabs.sendMessage(tabId, { stopRecord: true });
            });
        }

        this.setState({
            recording: willRecord
        });
    }

    render() {
        const { screenshots, recording } = this.state;
        console.log(screenshots);

        return (
            <div>
                <a onClick={this.record}>{recording ? 'Stop Recording' : 'Record Session'}</a>
                {screenshots.map(s => <img height={s.bounds.h / 4} width={s.bounds.w / 4} src={s.dataURI} />)}
            </div>
        )
    }
}
