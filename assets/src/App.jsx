
import {Button, Excalidraw, Footer, Sidebar, WelcomeScreen} from "@excalidraw/excalidraw";
import {useCallback, useEffect, useRef, useState} from "react";

import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from "./Login.jsx";
import {useDataProvider} from "./DataProvider.jsx";
import Files from "./Files.jsx";
import axios from "axios";


function App() {

    const UIOptions = {
        dockedSidebarBreakpoint: 0,
        canvasActions: {
            changeViewBackgroundColor: true,
            clearCanvas: true,
            loadScene: true,
        },
    };
    const [docked, setDocked] = useState(true);

    const {isAuth,token}=useDataProvider();

    const [excalidrawAPI, setExcalidrawAPI] = useState(null);

    useEffect(() => {
        if (excalidrawAPI === null){
            return;
        }
        axios.get('/api/library/load', {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }).then(r=>{
            r.data.data.map(lib=>{
                excalidrawAPI.updateLibrary({
                    libraryItems: lib.data.library ?? lib.data.libraryItems,
                    merge: true,
                    openLibraryMenu: false,
                });
            })

        }).catch(e=>{
            console.log(e);
            toast.error('Could not load library data!');
        })
    }, [excalidrawAPI]);


    const onChange = useCallback((elements, appState,files) => {
        localStorage.setItem("elements", JSON.stringify(elements));
        localStorage.setItem("appState", JSON.stringify(appState));
        localStorage.setItem("files", JSON.stringify(files));
        }, []);

    return (
        <>
            <ToastContainer
                position={"top-right"}
                autoClose={3500}
                newestOnTop
                pauseOnFocusLoss={false}
                theme={"colored"}
            />
            <div style={{height: "100vh"}}>
                <Excalidraw
                    excalidrawAPI={(api) => setExcalidrawAPI(api)}
                    UIOptions={UIOptions}
                    initialData={{
                        //appState: JSON.parse(localStorage.getItem('appState') ?? "{}"), //TODO: not working properly
                        elements: JSON.parse(localStorage.getItem('elements') ?? "[]"),
                        files: JSON.parse(localStorage.getItem('files') ?? "[]"),
                    }}
                    onChange={onChange}
                >


                    <Sidebar name="my_files" docked={docked} onDock={setDocked}>
                        <Sidebar.Header/>
                        <div style={{padding: "0.5rem", textAlign: "center"}}>
                            {isAuth ? <Files api={excalidrawAPI}/> : <Login/>}
                        </div>
                    </Sidebar>

                    <Footer>
                        <Sidebar.Trigger
                            name="my_files"
                            style={{
                                marginLeft: "0.5rem",
                                background: "#db70ec",
                                color: "white",
                            }}
                        >
                            My Files
                        </Sidebar.Trigger>
                    </Footer>

                </Excalidraw>

            </div>
        </>
    );
}

export default App;