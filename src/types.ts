export interface Recording {
    status: RecordingStatus;
    events: RecordingEvent[];
}

export interface RecordingEvent {
    bounds: {
        pageX: number;
        pageY: number;
        clientX: number;
        clientY: number;
    }
    image: string;
}

export enum RecordingStatus {
    'stopped' = 0,
    'started' = 1,
}

export enum ChromeTabStatus {
    'loading' = 'loading',
    'complete' = 'complete',
}