import React, { useRef } from "react";
import "./App.css";
import * as tf from "@tensorflow/tfjs"; // Don't remove it


import Camera     from './components/Camera/Camera';
import Simulation from './components/Simulation/Simulation';
import Preview    from './components/Preview/Preview';
import Timelines  from './components/Timelines/Timelines';



export default function App() {

  const webcamRef   = useRef(null);
  const canvasRef   = useRef(null);
  const previewRef  = useRef(null);

  return (
    <div id="app" className="center">

      <div className="applicationTitle">
        FACE RECOGNITION
      </div>

      <div className="application">
        <Camera     ref={webcamRef} />
        <Simulation ref={{webcamRef: webcamRef, canvasRef: canvasRef}}/>
        <Preview    ref={{webcamRef: webcamRef, previewRef: previewRef}}/>
        <Timelines  ref={{webcamRef: webcamRef, previewRef: previewRef}}/>
      </div>

    </div>
  );
}
