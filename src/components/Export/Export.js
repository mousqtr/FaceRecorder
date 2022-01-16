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

            <div className="block parameters">
                <h3 className="center">Parameters</h3>
                <div className="content">
                    <div className="setting piste">
                        <label for="piste">Piste</label>
                        <select>
                            <option>1</option>
                        </select>           
                    </div>
                    <div className="setting filename">
                        <label for="filename">Filename</label>
                        <input name="filename"/>
                    </div>
                    <div className="setting type">
                        <label for="type">Type</label>
                        <input type="checkbox" name="json"></input>
                        <label for="json">JSON</label>
                    </div>
                </div>
            </div>

            <div className="block actions">
                <h3 className="center">Actions</h3>
                <div className="content">
                    <div className="setting">
                        <button>
                            Export
                        </button>
                        <button>
                            Reset
                        </button>
                    </div>
                </div>
            </div>
            

            
            </div>
        </div>
    )
}