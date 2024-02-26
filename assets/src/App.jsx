
import {useState} from 'react';

function App() {

    const [count, setCount] = useState(0);
    return (
        <div>
            Hello {count}
            <button onClick={()=>setCount(count+1)}>++</button>
        </div>
    );
}

export default App;