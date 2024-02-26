
import React from 'react';

import App from "./App.jsx";
import { createRoot } from 'react-dom/client';

import axios from "axios";
import DataProvider from "./DataProvider.jsx";

axios.defaults.baseURL = "http://localhost";
axios.defaults.headers.common['Accept'] = 'application/json';

const container = document.getElementById('react');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
    <DataProvider>
        <App/>
    </DataProvider>
  );
