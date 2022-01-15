import React, { useRef, useEffect, useState } from "react";
import "./App.css";
import * as tf from "@tensorflow/tfjs";


import { drawMesh, drawFrame } from "./utilities";

import Camera from './components/Camera/Camera';
import Simulation from './components/Simulation/Simulation';
// import Preview from './components/Preview/Preview';
// import Timelines from './components/Timelines/Timelines';

var data = [];
var intervalPreview;


export default function App() {

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // const recRef = useRef(false);
  // const timelineRef = useRef(null);
  // const previewRef = useRef(null);

 
  




 

  // const handleTimeline = (e) => {

  //   // Update timeline position
  //   let size = Math.floor(e.clientX - timelineRef.current.getBoundingClientRect().left);
  //   setTimelinePosition(size);
  //   // let pct = Math.floor((size / timelineRef.current.clientWidth) * 100);

  //   // Change preview frame
  //   if (data.length > size) {
  //     const videoWidth = webcamRef.current.video.videoWidth;
  //     const videoHeight = webcamRef.current.video.videoHeight;
  //     previewRef.current.width = videoWidth;
  //     previewRef.current.height = videoHeight;
  //     const ctx = previewRef.current.getContext("2d");
  //     drawFrame(data[size], ctx);
  //   }
    
  // }

  // const handlePreviewPlay = () => {
  //   if (!isPreviewPlayed) {
  //     setPreviewPause(false);
  //     setPreviewPlay(true);
  //     console.log(timelinePosition);
  //     let index = timelinePosition;
  //     intervalPreview = setInterval(() => {
  //       if (data.length > index) {
  //         setTimelinePosition(index);

  //         const videoWidth = webcamRef.current.video.videoWidth;
  //         const videoHeight = webcamRef.current.video.videoHeight;
  //         previewRef.current.width = videoWidth;
  //         previewRef.current.height = videoHeight;
  //         const ctx = previewRef.current.getContext("2d");
  //         drawFrame(data[index], ctx);

  //         index++;
  //       }
  //     }, 100);
  //   }
  // }

  // const handlePreviewPause = () => {
  //   if (!isPreviewPaused) {
  //     setPreviewPlay(false);
  //     setPreviewPause(true);
  //     clearInterval(intervalPreview);
  //   }
  // }

  return (
    <div id="app" className="center">

      <div className="applicationTitle">
        FACE RECOGNITION
      </div>

      <div className="application">
        <Camera ref={webcamRef} />
        <Simulation 
          ref={{
            webcamRef: webcamRef,
            canvasRef: canvasRef
          }}
        />
      </div>


        {/* <div className="section square preview">
          <div className="title center">Preview</div>
          <canvas ref={previewRef} className="view"/>
          <div className="controls center">
          <button
              className={[(isPreviewPlayed) ? "btnClicked" : "btnNotClicked", "controlsBtn center"].join(' ')}
              onClick={handlePreviewPlay}>
                <img src={play} type="button" alt="play" />
            </button>
            <button
              className={[(isPreviewPaused) ? "btnClicked" : "btnNotClicked", "controlsBtn center"].join(' ')}
              onClick={handlePreviewPause}>
                <img src={pause} type="button" alt="pause" />
            </button>
          </div>
        </div>

        <div className="section rectangle timelines">
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
       */}

    </div>
  );
}
