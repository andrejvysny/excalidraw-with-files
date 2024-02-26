import React, {useContext, useEffect, useState} from 'react';

import axios from "axios";

import {toast} from "react-toastify";

export const DataProviderContext = React.createContext(null);

export function useDataProvider() {
    return useContext(DataProviderContext);
}

function DataProvider({children}) {


    const [user, setUser] = useState(localStorage.getItem('user'));
    const [token, setToken]=useState(localStorage.getItem('token'));
    const [isAuth, setAuth] = useState(!!localStorage.getItem('token'));
    const [files, setFiles]= useState([]);

    const logout = ()=>{
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        setUser(null);
        setToken(null);
        setAuth(null);
        setFiles([]);
    }

    const loadFiles = ()=>{
        axios.get('/api/files', {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }).then(r=>{

            setFiles(r.data);

        }).catch(e=>{
            console.log(e);
            //toast.error('Not able to load files');
        })
    }

    useEffect(()=>{

        if (isAuth){
            axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
        }

    },[isAuth]);





    const DATA = {
        files, setAuth, setUser, user, isAuth, token, setToken, logout, loadFiles
    };

    return (
        <DataProviderContext.Provider value={DATA}>
            {children}
        </DataProviderContext.Provider>
    );
}

export default DataProvider;