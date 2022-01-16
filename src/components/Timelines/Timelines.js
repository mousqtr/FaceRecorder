import React, { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";


import { drawFrame } from "./../../utilities";

import "./Timelines.css";

import trash from './../../assets/trash.png';

import * as recognitionActions      from './../../store/features/recognition';
import * as recognitionSelectors    from './../../store/selectors/recognition';


const Timelines = (props, ref) => {

    const dispatch = useDispatch();

    const selectedTrack     = useSelector(recognitionSelectors.getSelectedTrack);
    const tracks            = useSelector(recognitionSelectors.getTracks);

    const timelineRef = useRef(null);
    const { webcamRef, previewRef } = ref;

    const handleTimeline = (e) => {
        dispatch(recognitionActions.setPreviewStop(true));

        // Update timeline position
        let position = Math.floor(e.clientX - timelineRef.current.getBoundingClientRect().left);
        let payload = {index: selectedTrack, timelinePosition: position}
        dispatch(recognitionActions.setTimelinePosition(payload));
        // let pct = Math.floor((position / timelineRef.current.clientWidth) * 100);

        // Change preview frame
        if (selectedTrack > -1 && tracks[selectedTrack].data.length > position) {
            const videoWidth = webcamRef.current.videoWidth;
            const videoHeight = webcamRef.current.videoHeight;
            previewRef.current.width = videoWidth;
            previewRef.current.height = videoHeight;
            const ctx = previewRef.current.getContext("2d");
            drawFrame(tracks[selectedTrack].data[position], ctx);
        }
    }

    const handleSelectTrack = (pIndex) => {
        dispatch(recognitionActions.setSelectedTrack(pIndex));
    }

    const handleNew = () => {
        dispatch(recognitionActions.addTrack());
    }

    const handleDelete = (pindex) => {
        dispatch(recognitionActions.removeTrack(pindex));
    }

    return (
        <div id="timelines" className="section rectangle">
            <div className="title center">Timelines</div>
            <div className="view">
                <div className="toolsBar">
                    <button
                        className="center"                 
                        onClick={handleNew}>
                            New
                    </button>
                </div>
                {
                    tracks.map((track, index) => 
                        <div key={index} className="track" onClick={() => handleSelectTrack(index)} style={{backgroundColor: (selectedTrack === index) ? '#525252' : 'inherit'}}>
                            <div className="trackName center">Track {index + 1}</div>
                            <div className="timeline">
                                <div ref={timelineRef} className="timelineOut" onClick={(e) => handleTimeline(e)} style={{width: track.timelineWidth}}>
                                <div className="timelineIn" style={{width: track.timelinePosition+'px'}}></div>
                                </div>
                            </div>
                            <button
                                className="center"                 
                                onClick={() => handleDelete(index)}>
                                    <img src={trash} type="button" alt="trash" />
                            </button>
                        </div>
                    )
                }
                
            </div>
        </div>
    );
}

export default React.forwardRef(Timelines);
