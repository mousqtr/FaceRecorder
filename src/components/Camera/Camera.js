import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import "./Camera.css";



const Camera = React.forwardRef((props, ref) => (
    <div className="section square camera">
        <div className="title center">Webcam</div>
            <Webcam ref={ref} className="view"/>
        <div className="controls center"></div>
    </div>
));

export default Camera;