export interface Recording {
    status: RecordingStatus;
    events: RecordingEvent[];
}

export interface RecordingEvent {
    tab: string;
    image: string;
    bounds: {
        pageX: number;
        pageY: number;
        clientX: number;
        clientY: number;
    }
}

export enum RecordingStatus {
    'stopped' = 0,
    'started' = 1,
}

export enum ChromeTabStatus {
    'loading' = 'loading',
    'complete' = 'complete',
}

declare global {
    interface Window {
        FlowshotEvent: any;
    }
}
