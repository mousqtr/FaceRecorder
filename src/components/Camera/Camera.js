import React, { useState } from "react";
import { useSelector } from "react-redux";

import "./Camera.css";

import play     from './../../assets/play.png';
import pause    from './../../assets/pause.png';

import * as recognitionSelectors    from './../../store/selectors/recognition';



const Camera = (props, ref) => {

    // const [videoStream, setVideoStream] = useState(undefined);
    const isWebcamPlay = useSelector(recognitionSelectors.getWebcamPlay);

    const handlePlay = () => {
        if (!isWebcamPlay) {
            navigator.mediaDevices.getUserMedia({video: true, audio: false}).then( stream => {
                // setVideoStream(stream);
                console.log(ref.current.video);
                console.log(ref.current);
                ref.current.srcObject = stream;
                console.log(ref.current)
                ref.current.addEventListener("loadedmetadata", () => {
                    console.log("Load meta data")
                    ref.current.play();
                });
            })
        }
    }

    const handlePause = () => {
        if (isWebcamPlay) {
            console.log('handlePause');
        }
    }

    return (
        <div id="camera" className="section square">
            <div className="title center">Webcam</div>
                {/* <Webcam ref={ref} className="view"/> */}
                <video 
                    className='view'
                    ref={ref}>
                </video> 
                <div className="controls center">
                {
                    (!isWebcamPlay) ? 
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
            </div>
        </div>
    );
}


export default React.forwardRef(Camera);