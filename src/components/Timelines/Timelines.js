import React, { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";


import { drawFrame } from "./../../utilities";

import "./Timelines.css";

import trash from './../../assets/trash.png';

import * as recognitionActions      from './../../store/features/recognition';
import * as recognitionSelectors    from './../../store/selectors/recognition';


const Timelines = (props, ref) => {

    const dispatch = useDispatch();

    const timelineWidth     = useSelector(recognitionSelectors.getTimelineWidth);
    const timelinePosition  = useSelector(recognitionSelectors.getTimelinePosition); 
    const frames            = useSelector(recognitionSelectors.getFrames);

    const timelineRef = useRef(null);
    const { webcamRef, previewRef } = ref;

    const handleTimeline = (e) => {

        // Update timeline position
        let size = Math.floor(e.clientX - timelineRef.current.getBoundingClientRect().left);
        dispatch(recognitionActions.setTimelinePosition(size));
        // let pct = Math.floor((size / timelineRef.current.clientWidth) * 100);

        // Change preview frame
        if (frames.length > size) {
            const videoWidth = webcamRef.current.videoWidth;
            const videoHeight = webcamRef.current.videoHeight;
            previewRef.current.width = videoWidth;
            previewRef.current.height = videoHeight;
            const ctx = previewRef.current.getContext("2d");
            drawFrame(frames[size], ctx);
        }
        
    }

    return (
        <div id="timelines" className="section rectangle">
            <div className="title center">Timelines</div>
            <div className="view">
                <div className="piste">
                    <div className="pisteName center">Piste 1</div>
                    <div className="timeline">
                        <div ref={timelineRef} className="timelineOut" onClick={(e) => handleTimeline(e)} style={{width: timelineWidth}}>
                        <div className="timelineIn" style={{width: timelinePosition+'px'}}></div>
                        </div>
                    </div>
                    <button
                        className="center"                 
                        onClick={handleTimeline}>
                            <img src={trash} type="button" alt="trash" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default React.forwardRef(Timelines);
