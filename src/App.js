import React, { useRef } from "react";
import "./App.css";
import * as tf from "@tensorflow/tfjs"; // Don't remove it

import Camera     from './components/Camera/Camera';
import Simulation from './components/Simulation/Simulation';
import Preview    from './components/Preview/Preview';
import Timelines  from './components/Timelines/Timelines';
import Export     from './components/Export/Export';

import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {

  const webcamRef   = useRef(null);
  const canvasRef   = useRef(null);
  const previewRef  = useRef(null);

  return (
    <div id="app" className="center">

      <div className="applicationTitle">
        <p>FACE RECORDER</p>
      </div>

      <div className="application">
        <Camera     ref={webcamRef} />
        <Simulation ref={{webcamRef: webcamRef, canvasRef: canvasRef}}/>
        <Preview    ref={{webcamRef: webcamRef, previewRef: previewRef}}/>
        <Timelines  ref={{webcamRef: webcamRef, previewRef: previewRef}}/>
        <Export     />
      </div>

    </div>
  );
}
