import React, { useRef, useEffect, useState } from "react";
import "./App.css";
import * as tf from "@tensorflow/tfjs";

import * as facemesh from "@tensorflow-models/face-landmarks-detection";
import Webcam from "react-webcam";
import { drawMesh, drawFrame } from "./utilities";

// Import images
import play from './play.png';
import pause from './pause.png';
import record from './record.png';
import rolling from './rolling.gif';

var data = [];
var interval;
var intervalPreview;

function App() {

  const [isPlayed, setPlay] = useState(false);
  const [isPaused, setPause] = useState(false);
  const [isRecorded, setRecord] = useState(false);
  const [timelineWidth, setTimelineWidth] = useState('0px');
  const [timelinePosition, setTimelinePosition] = useState(0);
  const [frame, setFrame] = useState(-1);
  const [isPreviewPlayed, setPreviewPlay] = useState(false);
  const [isPreviewPaused, setPreviewPause] = useState(false);

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const loadingRef = useRef(null);
  const recordRef = useRef(false);
  const recRef = useRef(false);
  const timelineRef = useRef(null);
  const previewRef = useRef(null);

  //  Load posenet
  const runFacemesh = async () => {
    const net = await facemesh.load(facemesh.SupportedPackages.mediapipeFacemesh);
    interval = setInterval(() => {
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
        loadingRef.current.style.display = 'none';
        if (recordRef.current) {     
          console.log('record')
          recRef.current.style.display = 'block';
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
      setPause(false);
      runFacemesh();
      loadingRef.current.style.display = 'block';
    }
  }

  const handlePause = () => {
    if (!isPaused) {
      setPause(true);
      setPlay(false);
      clearInterval(interval);
    }
  }

  const handleRecord = () => {
    if (!isRecorded) {
      setRecord(true);
      recordRef.current = true;
    } else {
      setRecord(false);
      recordRef.current = false;
      recRef.current.style.display = 'none';
      setTimelineWidth(data.length + "px");
    }
  }

  const handleTimeline = (e) => {
    
    // Update timeline position
    let size = Math.floor(e.clientX - timelineRef.current.getBoundingClientRect().left);
    setTimelinePosition(size);
    // let pct = Math.floor((size / timelineRef.current.clientWidth) * 100);

    // Change preview frame
    if (data.length > size) {
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;
      previewRef.current.width = videoWidth;
      previewRef.current.height = videoHeight;
      const ctx = previewRef.current.getContext("2d");
      drawFrame(data[size], ctx);
    }
    
  }

  const handlePreviewPlay = () => {
    if (!isPreviewPlayed) {
      setPreviewPause(false);
      setPreviewPlay(true);
      console.log(timelinePosition);
      let index = timelinePosition;
      intervalPreview = setInterval(() => {
        if (data.length > index) {
          setTimelinePosition(index);

          const videoWidth = webcamRef.current.video.videoWidth;
          const videoHeight = webcamRef.current.video.videoHeight;
          previewRef.current.width = videoWidth;
          previewRef.current.height = videoHeight;
          const ctx = previewRef.current.getContext("2d");
          drawFrame(data[index], ctx);

          index++;
        }
      }, 10);
    }
  }

  const handlePreviewPause = () => {
    if (!isPreviewPaused) {
      setPreviewPlay(false);
      setPreviewPause(true);
      clearInterval(intervalPreview);
    }
  }

  return (
    <div id="app" className="center">

      <div className="applicationTitle center">
        FACE RECOGNITION
      </div>

      <div className="application">
        <div className="section square webcam">
          <div className="title center">Webcam</div>
          <Webcam ref={webcamRef} className="view"/>
          <div className="controls center"></div>
        </div>
        
        <div className="section square simulation">
          <div className="title center">Simulation</div>
          <canvas ref={canvasRef} className="view"/>
          <div className="controls center">
            <button
              className={[(isPlayed) ? "btnClicked" : "btnNotClicked", "controlsBtn center"].join(' ')}
              onClick={handlePlay}>
                <img src={play} type="button" alt="play" />
            </button>
            <button
              className={[(isPaused) ? "btnClicked" : "btnNotClicked", "controlsBtn center"].join(' ')}
              onClick={handlePause}>
                <img src={pause} type="button" alt="pause" />
            </button>
            <button
              className={[(isRecorded) ? "btnClicked" : "btnNotClicked", "controlsBtn center"].join(' ')}
              onClick={handleRecord}>
                <img src={record} type="button" alt="record" />
            </button>
          </div>
          <img ref={loadingRef} src={rolling} type="button" alt="rolling" className="rolling"/>
          <div ref={recRef} className="redPoint"></div>
        </div>

        <div className="section square preview">
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
      </div>

    </div>
  );
}

export default App;
