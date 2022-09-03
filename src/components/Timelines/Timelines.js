import React, { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";


import { drawFrame } from "./../../utilities";

import "./Timelines.css";

import { BsFillTrashFill } from 'react-icons/bs';

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
        dispatch(recognitionActions.setSelectedTrack(tracks.length));
    }

    const handleDelete = (pindex) => {
        dispatch(recognitionActions.removeTrack(pindex));
    }

    const handleReset = () => {
        dispatch(recognitionActions.resetTracks());
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
                    <button
                        className="center"                 
                        onClick={handleReset}>
                            Reset
                    </button>
                </div>
                <div className="content">
                {
                    tracks.map((track, index) => 
                        <div key={index} className="track" onClick={() => handleSelectTrack(index)} style={{backgroundColor: (selectedTrack === index) ? 'rgb(60 60 60)' : 'inherit'}}>
                            <div className="trackName center">Track {index + 1}</div>
                            <div className="timeline">
                                <div ref={timelineRef} className="timelineOut" onClick={(e) => handleTimeline(e)} style={{width: track.timelineWidth}}>
                                <div className="timelineIn" style={{width: track.timelinePosition+'px'}}></div>
                                </div>
                            </div>
                            <button className="center">
                                <BsFillTrashFill onClick={() => handleDelete(index)} />
                            </button>
                        </div>
                    )
                }
                </div>
            </div>
        </div>
    );
}

export default React.forwardRef(Timelines);
