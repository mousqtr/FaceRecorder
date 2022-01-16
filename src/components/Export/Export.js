import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import "./Export.css";

import * as recognitionActions      from './../../store/features/recognition';
import * as recognitionSelectors    from './../../store/selectors/recognition';


export default function Export () {

    const frames = useSelector(recognitionSelectors.getFrames);

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
    
    const handleExportJSON = (event) => {
        console.log(frames);
        event.preventDefault()
    
        let dataToExport = [];
        frames.forEach(element => {
            dataToExport.push(element);
        });
    
        downloadFile({
            data: JSON.stringify(dataToExport),
            fileName: 'data.json',
            fileType: 'text/json',
        });
    }

    return (
        <div id="export" className="section square">
            <div className="title center">Export</div>
            <div className="view">

            <div className="informations">
                <h3 className="center">Informations</h3>
                <div className="content">
                    <div className="setting piste">
                        <label for="piste">Piste</label>
                        <input name="piste" disabled></input>             
                    </div>
                    <div className="setting size">
                        <label for="size">Size</label>
                        <input name="size" disabled></input>             
                    </div>
                </div>
            </div>

            <div className="configurations">
                <h3 className="center">Configurations</h3>
                <div className="content">
                    <div className="setting filename">
                        <label for="filename">Filename</label>
                        <input name="filename"/>
                    </div>
                    <div className="setting type">
                        <label for="type">Type</label>
                        <input type="checkbox" name="json"></input>
                        <label for="json">JSON</label>
                    </div>
                    <div className="setting">
                    <button className="exportBtn">
                        Export
                    </button>
                    </div>
                </div>
            </div>
            

            
            </div>
        </div>
    )
}