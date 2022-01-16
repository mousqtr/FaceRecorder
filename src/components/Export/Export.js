import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import "./Export.css";

import * as recognitionActions      from './../../store/features/recognition';
import * as recognitionSelectors    from './../../store/selectors/recognition';


export default function Export () {

    const tracks = useSelector(recognitionSelectors.getTracks);

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
        console.log(tracks[0]);
        event.preventDefault()
    
        let dataToExport = [];
        tracks[0].forEach(element => {
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
                    <div className="setting track">
                        <label>Track</label>
                        <select>
                            <option>1</option>
                        </select>           
                    </div>
                    <div className="setting filename">
                        <label>Filename</label>
                        <input name="filename"/>
                    </div>
                    <div className="setting type">
                        <label>Type</label>
                        <input type="checkbox" name="json"></input>
                        <label>JSON</label>
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