
import {Excalidraw, Footer, Sidebar, WelcomeScreen} from "@excalidraw/excalidraw";
import {useState} from "react";
function App() {

    const UIOptions = {
        dockedSidebarBreakpoint: 0,

        canvasActions: {
            changeViewBackgroundColor: true,
            clearCanvas: true,
            loadScene: false,
        },
    };
    const [docked, setDocked] = useState(false);


    return (
        <>
            <div style={{height: "100vh"}}>
                <Excalidraw

                    UIOptions={UIOptions}
                    initialData={{
                        appState: { showWelcomeScreen: true,},
                    }}>

                    <WelcomeScreen />



                    <Sidebar name="custom" docked={docked} onDock={setDocked}>
                        <Sidebar.Header />
                        <Sidebar.Tabs style={{ padding: "0.5rem" }}>
                            <Sidebar.Tab tab="one">Tab one!</Sidebar.Tab>
                            <Sidebar.Tab tab="two">Tab two!</Sidebar.Tab>
                            <Sidebar.TabTriggers>
                                <Sidebar.TabTrigger tab="one">One</Sidebar.TabTrigger>
                                <Sidebar.TabTrigger tab="two">Two</Sidebar.TabTrigger>
                            </Sidebar.TabTriggers>
                        </Sidebar.Tabs>
                    </Sidebar>

                    <Footer>
                        <Sidebar.Trigger
                            name="custom"
                            tab="one"
                            style={{
                                marginLeft: "0.5rem",
                                background: "#70b1ec",
                                color: "white",
                            }}
                        >
                            Load Files
                        </Sidebar.Trigger>
                    </Footer>

                </Excalidraw>

            </div>
        </>
    );
}

export default App;