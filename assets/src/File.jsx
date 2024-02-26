import React from 'react';
import axios from "axios";
import {toast} from "react-toastify";
import {useDataProvider} from "./DataProvider.jsx";

function File({id,createdAt,name, path, api}) {

    const {loadFiles} = useDataProvider();
    const loadFile = path =>{

        axios.get(`${path}`)
            .then(response => {

                api.updateScene(response.data);

                let files = [];

                for (const fileId in response.data.files) {
                    files.push(response.data.files[fileId])
                }

                api.addFiles(files);

            })
            .catch(error => {
                // Handle any errors that occurred during the fetch operation
                console.error("Error fetching data: ", error);
            });

    }

    const save = ()=>{


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
            url:`/api/files/save?id=${id}`,
            data:file
        }).then(r=>{
            toast.success("Successfully Updated!");
            loadFiles();
        }).catch(e=>{
            toast.error("Could not save!");
            console.log(e);
        })



    }


    const deleteFile = ()=>{
        axios({
            method:"DELETE",
            url:`/api/files/remove/${id}`,
        }).then(r=>{
            toast.success("Successfully Deleted!");
            loadFiles();
        }).catch(e=>{
            toast.error("Could not save!");
            console.log(e);
        })
    }


    const formatTime = timestamp =>{
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() returns 0-11
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return `${day}-${month}-${year} ${hours}:${minutes}`;
    }


    return (
        <div className="file">

            <div style={{display: "block"}}>
                <strong style={{display: "block"}}>
                    {name}
                </strong>
                <small style={{display: "block"}}>
                    {formatTime(createdAt)}
                </small>
            </div>


            <div>
                <button className="excalidraw-button delete" onClick={() => deleteFile()}>
                    delete
                </button>
                <button className="excalidraw-button save" onClick={() => save(path)}>
                    save
                </button>
                <button className="excalidraw-button" onClick={() => loadFile(path)}>
                    load
                </button>
            </div>

        </div>
    );
}

export default File;