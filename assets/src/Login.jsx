import React, {useState} from 'react';
import axios from "axios";
import {toast} from "react-toastify";
import {useDataProvider} from "./DataProvider.jsx";
function Login(props) {

    const {setAuth, setUser, setToken} = useDataProvider();

    const [error, setError]=useState(null);
    const handleLogin = e => {
        e.preventDefault();

        if (e.target[0].value.trim() !== '' && e.target[1].value.trim() !== '') {

            axios.post("/api/login_check", {
                "username": e.target[0].value,
                "password": e.target[1].value
            }).then(r => {

                if(r.status === 200){
                    localStorage.setItem('token',r.data.token)
                    localStorage.setItem('user',e.target[0].value);
                    setAuth(true);
                    setToken(r.data.token);
                    setUser(e.target[0].value);
                }

            }).catch(e => {
                console.log(e);
                setError("wrong password or email")
            });

        }


    }

    return (
        <div>

            <form onSubmit={e=>handleLogin(e)} className="login-form">

                <h1>Login</h1>
                <input type="text" placeholder="Email" name="email"/>

                <input type="text" placeholder="Password" name="password"/>

                <p style={{color: "red"}}>{error}</p>

                <button className="excalidraw-button w-100" type="submit">Login</button>

            </form>

        </div>
    );
}

export default Login;