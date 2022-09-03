import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import "./Camera.css";

import rolling  from './../../assets/rolling.gif';

import * as recognitionActions      from './../../store/features/recognition';
import * as recognitionSelectors    from './../../store/selectors/recognition';

import { BsFillPlayFill, BsFillPauseFill } from 'react-icons/bs';



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
                <div className="center controls-btn">
                    { (!isWebcamPlay) ? <BsFillPlayFill onClick={handlePlay} /> : <BsFillPauseFill onClick={handlePause} />}
                </div>         
            </div>
            {
                (isLoading) ? <img src={rolling} type="button" alt="rolling" className="rolling"/> : <></>
            }
        </div>
    );
}


export default React.forwardRef(Camera);