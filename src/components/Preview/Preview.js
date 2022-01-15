import React from "react";
import { useSelector, useDispatch } from "react-redux";


import { drawFrame } from "./../../utilities";

import "./Preview.css";

import play     from './../../assets/play.png';
import pause    from './../../assets/pause.png';

import * as recognitionActions      from './../../store/features/recognition';
import * as recognitionSelectors    from './../../store/selectors/recognition';


var interval;

function Preview (props, ref) {

    const dispatch = useDispatch();

    const isPreviewPlay     = useSelector(recognitionSelectors.getPreviewPlay);
    const frames            = useSelector(recognitionSelectors.getFrames);
    const timelinePosition  = useSelector(recognitionSelectors.getTimelinePosition);

    const { webcamRef, previewRef } = ref;


    const handlePlay = () => {
        if (!isPreviewPlay) {
            dispatch(recognitionActions.setPreviewPlay(true));
            console.log(timelinePosition);
            let index = timelinePosition;
            interval = setInterval(() => {
                if (frames.length > index) {
                    dispatch(recognitionActions.setTimelinePosition(index));
                    const videoWidth = webcamRef.current.video.videoWidth;
                    const videoHeight = webcamRef.current.video.videoHeight;
                    previewRef.current.width = videoWidth;
                    previewRef.current.height = videoHeight;
                    const ctx = previewRef.current.getContext("2d");
                    drawFrame(frames[index], ctx);
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
                        className="btnNotClicked controlsBtn center"
                        onClick={handlePlay}>
                            <img src={play} type="button" alt="play" />
                    </button> : 
                    <button
                        className="btnNotClicked controlsBtn center"                 
                        onClick={handlePause}>
                            <img src={pause} type="button" alt="pause" />
                    </button>
                }
            </div>
        </div>
    );
}

export default Preview = React.forwardRef(Preview);