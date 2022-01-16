import React, { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as facemesh from "@tensorflow-models/face-landmarks-detection";


import { drawMesh } from "./../../utilities";

import "./Simulation.css";

import play     from './../../assets/play.png';
import pause    from './../../assets/pause.png';
import record   from './../../assets/record.png';
import save     from './../../assets/save.png';
import rolling  from './../../assets/rolling.gif';

import * as recognitionActions      from './../../store/features/recognition';
import * as recognitionSelectors    from './../../store/selectors/recognition';


var interval;
var data = [];

const Simulation = (props, ref) => {

    const dispatch = useDispatch();

    const isSimulationPlay   = useSelector(recognitionSelectors.getSimulationPlay);
    const isSimulationRecord = useSelector(recognitionSelectors.getSimulationRecord);
    const isWebcamPlay       = useSelector(recognitionSelectors.getWebcamPlay);
    const selectedTrack      = useSelector(recognitionSelectors.getSelectedTrack);
    const tracks             = useSelector(recognitionSelectors.getTracks);
    const isSimulationStop   = useSelector(recognitionSelectors.getSimulationStop);

    const { webcamRef, canvasRef } = ref;
    const loadingRef = useRef(null);
    const recordRef = useRef(false);
    const redPointRef = useRef(false);
    const loadFinishRef = useRef(false);

    useEffect(() => {
        if (isSimulationStop) {
            dispatch(recognitionActions.setSimulationStop(false));
            handlePause();
        }
    }, [isSimulationStop])

    const handlePlay = () => {
        if (!isSimulationPlay && isWebcamPlay) {
            dispatch(recognitionActions.setSimulationPlay(true));
            runFacemesh();
            loadingRef.current.style.display = 'block';
        }
    }

    const handlePause = () => {
        if (isSimulationPlay) {
            dispatch(recognitionActions.setSimulationPlay(false));
            clearInterval(interval);
        }
    }

    const handleRecord = () => {
        if (!isSimulationRecord && selectedTrack > -1 && loadFinishRef.current) {
            dispatch(recognitionActions.setSimulationRecord(true));
            recordRef.current = true;
        }
    }

    const handleSave = () => {
        if (isSimulationRecord) {
            dispatch(recognitionActions.addFrames(data));
            dispatch(recognitionActions.setSimulationRecord(false));
            let payload = {index: selectedTrack, timelineWidth: data.length + "px"}
            dispatch(recognitionActions.setTimelineWidth(payload));
            recordRef.current = false;
            data = [];
        }
    }
    

    const runFacemesh = async () => {
      const net = await facemesh.load(facemesh.SupportedPackages.mediapipeFacemesh);
      interval = setInterval(() => {
        detect(net);
      }, 10);
    };

    const detect = async (net) => {

        const videoWidth = webcamRef.current.videoWidth;
        const videoHeight = webcamRef.current.videoHeight;
        webcamRef.current.width = videoWidth;
        webcamRef.current.height = videoHeight;
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        if (typeof webcamRef.current !== "undefined" &&
            webcamRef.current !== null &&
            webcamRef.current.readyState === 4) {

                // Get Video Properties
                const video = webcamRef.current;

                // Make Detections
                const face = await net.estimateFaces({input:video});
                if (face.length > 0) {
                    loadFinishRef.current = true;
                    loadingRef.current.style.display = 'none';
                    if (recordRef.current) {    
                        data.push(face[0].scaledMesh);
                        redPointRef.current.style.display = 'block';
                    } else {
                        redPointRef.current.style.display = 'none';
                    } 
                }

                // Get canvas context
                const ctx = canvasRef.current.getContext("2d");
                requestAnimationFrame(() => {
                    drawMesh(face, ctx)
                });
        }
    };

    return (
        <div id="simulation" className="section square">
            <div className="title center">Simulation</div>
            <canvas ref={canvasRef} className="view"/>
            <div className="controls center">
                {
                    (!isSimulationPlay) ? 
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
                {
                    (!isSimulationRecord) ? 
                    <button
                        className="controlsBtn center"
                        onClick={handleRecord}>
                            <img src={record} type="button" alt="play" />
                    </button> : 
                    <button
                        className="controlsBtn center"                 
                        onClick={handleSave}>
                            <img src={save} type="button" alt="save" />
                    </button>
                }
            </div>
            <img ref={loadingRef} src={rolling} type="button" alt="rolling" className="rolling"/>
            <div ref={redPointRef} className="redPoint"></div>
        </div>
    );
}

export default React.forwardRef(Simulation);

