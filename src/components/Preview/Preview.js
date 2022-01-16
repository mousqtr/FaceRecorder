import React from "react";
import { useSelector, useDispatch } from "react-redux";


import { drawFrame } from "./../../utilities";

import "./Preview.css";

import play     from './../../assets/play.png';
import pause    from './../../assets/pause.png';

import * as recognitionActions      from './../../store/features/recognition';
import * as recognitionSelectors    from './../../store/selectors/recognition';


var interval;

const Preview = (props, ref) => {

    const dispatch = useDispatch();

    const isPreviewPlay     = useSelector(recognitionSelectors.getPreviewPlay);
    const selectedTrack     = useSelector(recognitionSelectors.getSelectedTrack);
    const tracks            = useSelector(recognitionSelectors.getTracks);

    const { webcamRef, previewRef } = ref;

    const handlePlay = () => {
        const videoWidth = webcamRef.current.videoWidth;
        const videoHeight = webcamRef.current.videoHeight;

        if (!isPreviewPlay && selectedTrack > -1) {
            dispatch(recognitionActions.setPreviewPlay(true));
            let index = tracks[selectedTrack].timelinePosition;
            interval = setInterval(() => {
                if (tracks[selectedTrack].data.length > index) {
                    let payload = {index: selectedTrack, timelinePosition: index};
                    dispatch(recognitionActions.setTimelinePosition(payload));
                    previewRef.current.width = videoWidth;
                    previewRef.current.height = videoHeight;
                    const ctx = previewRef.current.getContext("2d");
                    drawFrame(tracks[selectedTrack].data[index], ctx);
                    index++;
                }
            }, 100);
        }
    }

    const handlePause = () => {
        if (isPreviewPlay) {
            dispatch(recognitionActions.setPreviewPlay(false));
            clearInterval(interval);
        }
    }

    return (
        <div id="preview" className="section square">
            <div className="title center">Preview</div>
            <canvas ref={previewRef} className="view"/>
            <div className="controls center">
                {
                    (!isPreviewPlay) ? 
                    <button
                        className="controlsBtn center"
                        onClick={handlePlay}>
                            <img src={play} type="button" alt="play" />
                    </button> : 
                    <button
                        className="controlsBtn center"                 
                        onClick={handlePause}>
                            <img src={pause} type="button" alt="pause" />
                    </button>
                }
            </div>
        </div>
    );
}

export default React.forwardRef(Preview);