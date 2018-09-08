import * as React from 'react';
import './Popup.scss';

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

    capture = () => {
        chrome.tabs.captureVisibleTab(null,
            { format: 'png', quality: 100 }, (dataURI) => {
                if (dataURI) {
                    const fauxImage = new Image();
                    fauxImage.src = dataURI;
                    fauxImage.onload = () => {
                        console.log(fauxImage)

                        this.setState((prevState) => ({
                            screenshots: [...prevState.screenshots, {
                                title: 'any',
                                date: Date.now(),
                                dataURI,
                                bounds: {
                                    h: fauxImage.height,
                                    w: fauxImage.width,
                                }
                            }]
                        }));
                    }
                }
            });
        chrome.runtime.sendMessage({ capture: true });
    }

    record = () => {
        const willRecord = !this.state.recording;

        if (willRecord) {
            chrome.tabs.query({
                active: true,
                currentWindow: true,
            }, (tabs) => {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    { record: true }, (res) => {
                        chrome.tabs.executeScript(tabs[0].id, { file: 'js/clientScript.js' });
                    }
                );
            });
        } else {
            chrome.tabs.query({
                active: true,
                currentWindow: true,
            }, (tabs) => {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    { stopRecord: true }
                );
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
                <a onClick={this.capture}>Capture</a>
                {screenshots.map(s => <img height={s.bounds.h / 4} width={s.bounds.w / 4} src={s.dataURI} />)}
            </div>
        )
    }
}
