import React, {useEffect, useState} from 'react';
import {useDataProvider} from "./DataProvider.jsx";
import File from "./File.jsx";
import {toast} from "react-toastify";
import axios from "axios";

function Files({api}) {

    const {user, files, loadFiles, logout} = useDataProvider();
    const [newName,setNewName] = useState("example");
    useEffect(() => {

        loadFiles();
    }, []);

    const saveCurrent = () => {

        const appState = {
            "gridSize": api.getAppState().gridSize,
            "viewBackgroundColor": api.getAppState().viewBackgroundColor
        }

        console.log(appState);

        const file = {
            "type": "excalidraw",
            "version": 2,
            "source": "https://draw.andrejvysny.sk",
            "elements": api.getSceneElements(),
            "appState": appState,
            "files": api.getFiles(),
            }

        axios({
            method:"POST",
            url:`/api/files/save?name=${newName}`,
            data:file
        }).then(r=>{
            toast.success("Successfully Saved!");
            loadFiles();
        }).catch(e=>{
            toast.error("Could not save!");
            console.log(e);
        })


    }




    return (
        <div className="files">

            <h3>Your Files</h3>
            <p>{user}</p>
            <button onClick={() => logout()} className="excalidraw-button"
                    style={{padding: "0 30px", background: "#db70ec"}}>Logout
            </button>
            <hr/>

            {files.map(file => {
                return <File api={api} createdAt={file.createdAt} key={file.id} name={file.name} id={file.id} path={file.path}/>
            })}


            <div className="file" style={{position:"absolute", bottom: 0}}>
                <input type="text" value={newName}  onChange={(e) => setNewName(e.target.value)}
                />
                <button className="excalidraw-button save" onClick={() => saveCurrent()}>
                    save
                </button>
            </div>
        </div>
    );
}

export default Files;