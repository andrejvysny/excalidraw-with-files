
import {Button, Excalidraw, Footer, Sidebar, WelcomeScreen} from "@excalidraw/excalidraw";
import {useState} from "react";

import { ToastContainer } from 'react-toastify';
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

    const {isAuth}=useDataProvider();

    const [excalidrawAPI, setExcalidrawAPI] = useState(null);

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
                        appState: { showWelcomeScreen: true,},
                    }}>


                    <Sidebar name="my_files"  docked={docked} onDock={setDocked}>
                        <Sidebar.Header />
                        <div style={{padding: "0.5rem", textAlign:"center"}}>
                            {isAuth ?  <Files api={excalidrawAPI}/> : <Login/>}
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