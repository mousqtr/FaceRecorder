import { createSlice } from '@reduxjs/toolkit'
 
const { actions, reducer } = createSlice({
    name: 'recognition',
    initialState: { 
        isWebcamPlay: false,
        isSimulationPlay: false,
        isSimulationRecord: false,
        isSimulationLoading: false,
        isPreviewPlay: false,
        tracks: [],
        selectedTrack: -1,
        isSimulationStop: false,
        isPreviewStop: false
    },
    reducers: {
        setWebcamPlay: (state, action) => {
            state.isWebcamPlay = action.payload
        },
        setSimulationPlay: (state, action) => {
            state.isSimulationPlay = action.payload
        },
        setSimulationRecord: (state, action) => {
            state.isSimulationRecord = action.payload
        },
        setPreviewPlay: (state, action) => {
            state.isPreviewPlay = action.payload
        },
        setTimelineWidth: (state, action) => {
            if (state.tracks[action.payload.index]) {
                state.tracks[action.payload.index].timelineWidth = action.payload.timelineWidth;
            }
        },
        setTimelinePosition: (state, action) => {
            if (state.tracks[action.payload.index]) {
                state.tracks[action.payload.index].timelinePosition = action.payload.timelinePosition;
            }
        },
        addTrack: (state, action) => {
            state.tracks.push({
                timelineWidth: '0px',
                timelinePosition: 0,
                data: []
            });
        },
        removeTrack: (state, action) => {
            if (action.payload > -1 && action.payload < state.tracks.length) {
                state.tracks.splice(action.payload, 1);
                if (action.payload === state.selectedTrack) {
                    state.selectedTrack = -1;
                }
            }
        },
        resetTracks: (state, action) => {
            state.tracks = [];
            state.selectedTrack = -1;
        },
        addFrame: (state, action) => {
            if (state.selectedTrack > -1 
                && state.selectedTrack < state.tracks.length
                && state.tracks[state.selectedTrack]) {
                state.tracks[state.selectedTrack].data.push(action.payload);
            }
        },
        addFrames: (state, action) => {
            if (state.selectedTrack > -1 
                && state.selectedTrack < state.tracks.length
                && state.tracks[state.selectedTrack]) {
                    state.tracks[state.selectedTrack].data = state.tracks[state.selectedTrack].data.concat(action.payload);
            }
        },
        setSelectedTrack: (state, action) => {
            if (state.tracks.length > action.payload) {
                state.selectedTrack = action.payload
            }
        },
        setSimulationStop: (state, action) => {
            state.isSimulationStop = action.payload
        },
        setPreviewStop: (state, action) => {
            state.isPreviewStop = action.payload
        }
    },
});

export const { 
    setWebcamPlay,
    setSimulationPlay,
    setSimulationRecord,
    setPreviewPlay,
    setTimelineWidth,
    setTimelinePosition,
    addTrack,
    removeTrack,
    resetTracks,
    addFrame,
    addFrames,
    setSelectedTrack,
    setSimulationStop,
    setPreviewStop
} = actions;

export default reducer;