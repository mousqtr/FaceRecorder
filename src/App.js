import React, { useRef, useEffect, useState } from "react";
import "./App.css";
import * as tf from "@tensorflow/tfjs";

import * as facemesh from "@tensorflow-models/face-landmarks-detection";
import Webcam from "react-webcam";
import { drawMesh } from "./utilities";

// Import images
import play from './play.png';
import rolling from './rolling.gif';

var data = [];

function App() {

  const [isPlayed, setPlay] = useState(false);
  const [isLoading, setLoading] = useState(false);


  const [isStarted, setStart] = useState(false);
  const [isInProgress, setInProgress] = useState(false);

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const loadingRef = useRef(null);

  //  Load posenet
  const runFacemesh = async () => {
    const net = await facemesh.load(facemesh.SupportedPackages.mediapipeFacemesh);
    setInterval(() => {
      detect(net);
    }, 10);
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
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
        // if (isLoading) setLoading(false);
        loadingRef.current.style.display = 'none';
        
        if (isStarted) {
          if (!isInProgress) setInProgress(true);
          data.push(face[0].scaledMesh);
        }
      }

      // Get canvas context
      const ctx = canvasRef.current.getContext("2d");
      requestAnimationFrame(()=>{drawMesh(face, ctx)});
    }
  };
  

  const downloadFile = ({ data, fileName, fileType }) => {
    const blob = new Blob([data], { type: fileType });
    const a = document.createElement('a');
    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);
    const clickEvt = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    })
    a.dispatchEvent(clickEvt);
    a.remove();
  }

  const handleSave = (event) => {
    console.log(data);
    event.preventDefault()

    let dataToExport = [];
    data.forEach(element => {
      dataToExport.push(element);
    });

    downloadFile({
      data: JSON.stringify(dataToExport),
      fileName: 'data.json',
      fileType: 'text/json',
    });
  }

  const handlePlay = () => {
    if (!isPlayed) {
      setPlay(true);
      setLoading(true);
      runFacemesh();
    }
  }

  return (
    <div id="app" className="center">

      <div className="applicationTitle center">FACE RECOGNITION</div>
      <div className="application">
        <div className="section views">
          <div className="title center">Webcam</div>
          <Webcam ref={webcamRef} className="view"/>
          <div className="controls center"></div>
        </div>
        
        <div className="section views">
          <div className="title center">Simulation</div>
          <canvas ref={canvasRef} className="view simulation"/>
          <div className="controls center">
            <button
              className={[(isPlayed) ? "btnClicked" : "btnNotClicked", "controlsBtn center"].join(' ')}
              onClick={handlePlay}>
                <img src={play} type="button" alt="play" />
            </button>
          </div>
          {
            (isLoading === true) ? <img ref={loadingRef} src={rolling} type="button" alt="rolling" className="rolling"/> : <></>
          }
        </div>

        <div className="section views">
          <div className="title center">Preview</div>
          <canvas className="view result"/>
          <div className="controls center"></div>
        </div>

        <div className="section panel">
          <div className="title center">Control panel</div>
        </div>

      </div>
    </div>
  );
}

export default App;
