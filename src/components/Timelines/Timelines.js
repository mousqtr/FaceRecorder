import React, { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";


import { drawFrame } from "./../../utilities";

import "./Timelines.css";


import * as recognitionActions      from './../../store/features/recognition';
import * as recognitionSelectors    from './../../store/selectors/recognition';


function Timelines (props, ref) {

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
            const videoWidth = webcamRef.current.video.videoWidth;
            const videoHeight = webcamRef.current.video.videoHeight;
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
                </div>
            </div>
        </div>
    );
}

export default Timelines = React.forwardRef(Timelines);
