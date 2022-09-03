import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";


import { drawFrame } from "./../../utilities";

import "./Preview.css";

import { BsFillPlayFill, BsFillPauseFill } from 'react-icons/bs';

import * as recognitionActions      from './../../store/features/recognition';
import * as recognitionSelectors    from './../../store/selectors/recognition';


var interval;
var iteration = 0;

const Preview = (props, ref) => {

    const dispatch = useDispatch();

    const isPreviewPlay     = useSelector(recognitionSelectors.getPreviewPlay);
    const selectedTrack     = useSelector(recognitionSelectors.getSelectedTrack);
    const tracks            = useSelector(recognitionSelectors.getTracks);
    const isPreviewStop     = useSelector(recognitionSelectors.getPreviewStop);

    const { webcamRef, previewRef } = ref;

    useEffect(() => {
        if (isPreviewStop) {
            dispatch(recognitionActions.setPreviewStop(false));
            handlePause();
        }
    }, [isPreviewStop]);

    const handlePlay = () => {
        dispatch(recognitionActions.setSimulationStop(true));
        const videoWidth = webcamRef.current.videoWidth;
        const videoHeight = webcamRef.current.videoHeight;

        if (!isPreviewPlay && selectedTrack > -1) {
            dispatch(recognitionActions.setPreviewPlay(true));
            iteration = tracks[selectedTrack].timelinePosition;
            interval = setInterval(() => {
                if (tracks[selectedTrack].data.length > iteration) {
                    previewRef.current.width = videoWidth;
                    previewRef.current.height = videoHeight;
                    const ctx = previewRef.current.getContext("2d");
                    drawFrame(tracks[selectedTrack].data[iteration], ctx);
                    iteration++;
                } else {
                    let payload = {index: selectedTrack, timelinePosition: iteration};
                    dispatch(recognitionActions.setTimelinePosition(payload));
                    iteration = 0;
                }
            }, 100);
        }
    }

    const handlePause = () => {
        if (isPreviewPlay) {
            dispatch(recognitionActions.setPreviewPlay(false));
            clearInterval(interval);
            let payload = {index: selectedTrack, timelinePosition: iteration};
            dispatch(recognitionActions.setTimelinePosition(payload));
            iteration = 0;
        }
    }

    return (
        <div id="preview" className="section square">
            <div className="title center">Preview</div>
            <canvas ref={previewRef} className="view"/>
            <div className="controls center">
                <div className="center controls-btn">
                    { (!isPreviewPlay) ? <BsFillPlayFill onClick={handlePlay} /> : <BsFillPauseFill onClick={handlePause} />}
                </div>
            </div>
        </div>
    );
}

export default React.forwardRef(Preview);