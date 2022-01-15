import { createSlice } from '@reduxjs/toolkit'
 
const { actions, reducer } = createSlice({
    name: 'recognition',
    initialState: { 
        isWebcamPlay: false,
        isSimulationPlay: false,
        isSimulationRecord: false,
        isSimulationLoading: false,
        isPreviewPlay: false,
        timelineWidth: '0px',
        timelinePosition: 0
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
            state.timelineWidth = action.payload
        },
        setTimelinePosition: (state, action) => {
            state.timelinePosition = action.payload
        },
    },
});

export const { 
    setWebcamPlay,
    setSimulationPlay,
    setSimulationRecord,
    setPreviewPlay,
    setTimelineWidth,
    setTimelinePosition
} = actions;

export default reducer;