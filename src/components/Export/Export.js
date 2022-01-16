import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import "./Export.css";

import * as recognitionActions      from './../../store/features/recognition';
import * as recognitionSelectors    from './../../store/selectors/recognition';


export default function Export () {

    const tracks = useSelector(recognitionSelectors.getTracks);
    const [filename, setFilename] = useState('');
    const [numTrack, setNumTrack] = useState('');
    const [type, setType] = useState('');

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
    
    const handleExport = (event) => {
        event.preventDefault()

        if (filename !== '' && 
            numTrack !== 'Piste' && 
            type !== '') {
                let dataToExport = [];
                tracks[0].data.forEach(element => {
                    dataToExport.push(element);
                });
            
                downloadFile({
                    data: JSON.stringify(dataToExport),
                    fileName: 'data.json',
                    fileType: 'text/json',
                });
        }
    }

    const handleChangeType = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        if (value && target.id === 'checkbox-json') {
            setType('json');
        } else {
            setType('');
        }
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
                        <select value={numTrack} onChange={(e) => setNumTrack(e.target.value)}>
                            <option value="Piste">Piste</option>   
                            {
                                tracks.map((track, index) => {
                                    return <option value={index} key={index}>{index+1}</option>
                                }) 
                            }   
                        </select>           
                    </div>
                    <div className="setting filename">
                        <label>Filename</label>
                        <input 
                            type="text" 
                            placeholder="Filename"
                            value={filename}
                            onChange={(e) => setFilename(e.target.value)}/>
                    </div>
                    <div className="setting type">
                        <label>Type</label>
                        <input 
                            type="checkbox" 
                            checked={(type === 'json') ? true : false}
                            onChange={(e) => handleChangeType(e)}
                            id={'checkbox-json'}>
                        </input>
                        <label>JSON</label>
                    </div>
                </div>
            </div>

            <div className="block actions">
                <h3 className="center">Actions</h3>
                <div className="content">
                    <div className="setting">
                        <button onClick={handleExport}>
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