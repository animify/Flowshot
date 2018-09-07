import * as React from 'react';
import './Popup.scss';

interface AppProps { }

interface AppState {
    screenshots: Screenshot[]
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
        screenshots: []
    }

    constructor(props: AppProps, state: AppState) {
        super(props, state);
    }

    componentDidMount() {
        chrome.runtime.sendMessage({ popupMounted: true });
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

    render() {
        const { screenshots } = this.state;
        console.log(screenshots);

        return (
            <div>
                <a onClick={this.capture}>Capture</a>
                {screenshots.map(s => <img height={s.bounds.h / 4} width={s.bounds.w / 4} src={s.dataURI} />)}
            </div>
        )
    }
}
