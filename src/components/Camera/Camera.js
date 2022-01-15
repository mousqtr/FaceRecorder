import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";

import "./Camera.css";



function Camera (props, ref) {
    return (
        <div id="camera" className="section square">
            <div className="title center">Webcam</div>
                <Webcam ref={ref} className="view"/>
            <div className="controls center"></div>
        </div>
    );
}

export default Camera = React.forwardRef(Camera);
