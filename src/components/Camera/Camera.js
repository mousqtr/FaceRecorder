import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import "./Camera.css";

import play     from './../../assets/play.png';
import pause    from './../../assets/pause.png';
import rolling  from './../../assets/rolling.gif';

import * as recognitionActions      from './../../store/features/recognition';
import * as recognitionSelectors    from './../../store/selectors/recognition';



const Camera = (props, ref) => {

    const dispatch = useDispatch();

    const [videoStream, setVideoStream] = useState(undefined);
    const [isLoading, setLoading] = useState(false);

    const isWebcamPlay = useSelector(recognitionSelectors.getWebcamPlay);

    const handlePlay = () => {
        if (!isWebcamPlay) {
            setLoading(true);
            dispatch(recognitionActions.setWebcamPlay(true));
            navigator.mediaDevices.getUserMedia({video: true, audio: false}).then( stream => {
                setVideoStream(stream);
                ref.current.srcObject = stream;
                ref.current.addEventListener("loadedmetadata", () => {
                    setLoading(false);
                    ref.current.play();
                });
            })
        }
    }

    const handlePause = () => {
        if (isWebcamPlay) {
            dispatch(recognitionActions.setWebcamPlay(false));
            videoStream.getVideoTracks().forEach((track) => {
                track.stop();
                videoStream.removeTrack(track);
            });
            ref.current.srcObject = undefined;
            setVideoStream(undefined);
        }
    }

    return (
        <div id="camera" className="section square">
            <div className="title center">Webcam</div>    
            <video 
                className='view'
                ref={ref}>
            </video> 
            <div className="controls center">
                {
                    (!isWebcamPlay) ? 
                    <button
                        className="center"
                        onClick={handlePlay}>
                            <img src={play} type="button" alt="play" />
                    </button> : 
                    <button
                        className="center"                 
                        onClick={handlePause}>
                            <img src={pause} type="button" alt="pause" />
                    </button>
                }               
            </div>
            {
                (isLoading) ? <img src={rolling} type="button" alt="rolling" className="rolling"/> : <></>
            }
        </div>
    );
}


export default React.forwardRef(Camera);