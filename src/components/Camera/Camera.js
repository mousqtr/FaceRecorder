import React from "react";
import Webcam from "react-webcam";

import "./Camera.css";



const Camera = (props, ref) => {
    return (
        <div id="camera" className="section square">
            <div className="title center">Webcam</div>
                <Webcam ref={ref} className="view"/>
            <div className="controls center"></div>
        </div>
    );
}


export default React.forwardRef(Camera);