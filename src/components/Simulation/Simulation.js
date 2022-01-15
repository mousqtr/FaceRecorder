import React, { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as facemesh from "@tensorflow-models/face-landmarks-detection";


import { drawMesh, drawFrame } from "./../../utilities";

import "./Simulation.css";

import play     from './../../assets/play.png';
import pause    from './../../assets/pause.png';
import record   from './../../assets/record.png';
import rolling  from './../../assets/rolling.gif';

import * as recognitionActions      from './../../store/features/recognition';
import * as recognitionSelectors    from './../../store/selectors/recognition';


var interval;
var data = [];

function Simulation (props, ref) {

    const dispatch = useDispatch();
    const isSimulationPlay = useSelector(recognitionSelectors.getSimulationPlay);
    const isSimulationRecord = useSelector(recognitionSelectors.getSimulationRecord);

    const { webcamRef, canvasRef } = ref;
    const loadingRef = useRef(null);
    const recordRef = useRef(false);
    const redPointRef = useRef(false);

    const handlePlay = () => {
        if (!isSimulationPlay) {
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
        if (!isSimulationRecord) {
            dispatch(recognitionActions.setSimulationRecord(true));
            recordRef.current = true;
        } else {
            dispatch(recognitionActions.setSimulationRecord(false));
            dispatch(recognitionActions.setTimelineWidth(data.length + "px"));
            recordRef.current = false;
        }
    }

    const runFacemesh = async () => {
      const net = await facemesh.load(facemesh.SupportedPackages.mediapipeFacemesh);
      interval = setInterval(() => {
        detect(net);
      }, 10);
    };

    const detect = async (net) => {
        if (typeof webcamRef.current !== "undefined" &&
            webcamRef.current !== null &&
            webcamRef.current.video.readyState === 4) {

                // Get Video Properties
                const video = webcamRef.current.video;
                const videoWidth = webcamRef.current.video.videoWidth;
                const videoHeight = webcamRef.current.video.videoHeight;

                // Set video width
                webcamRef.current.video.width = videoWidth;
                webcamRef.current.video.height = videoHeight;

                // Set canvas width
                canvasRef.current.width = videoWidth;
                canvasRef.current.height = videoHeight;

                // Make Detections
                const face = await net.estimateFaces({input:video});
                if (face.length > 0) {
                    loadingRef.current.style.display = 'none';
                    if (recordRef.current) {     
                        console.log('record')        
                        data.push(face[0].scaledMesh);
                        redPointRef.current.style.display = 'block';
                    } else {
                        redPointRef.current.style.display = 'none';
                    } 
                }

                // Get canvas context
                const ctx = canvasRef.current.getContext("2d");
                requestAnimationFrame(()=>{drawMesh(face, ctx)});
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
                <button
                    className={[(isSimulationRecord) ? "btnClicked" : "btnNotClicked", "controlsBtn center"].join(' ')}
                    onClick={handleRecord}>
                    <img src={record} type="button" alt="record" />
                </button>
            </div>
            <img ref={loadingRef} src={rolling} type="button" alt="rolling" className="rolling"/>
            <div ref={redPointRef} className="redPoint"></div>
        </div>
    );
}

export default Simulation = React.forwardRef(Simulation);
