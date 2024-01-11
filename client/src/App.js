import React from "react";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from '../src/pages/Login';
import Register from '../src/pages/Register';
import Dashboard from "./Dashboard";

const App = () =>{
    return <div>
        <BrowserRouter>
        <Routes>
            <Route path = '/login' exact element = {<Login/>} />
            <Route path = '/register' exact element = {<Register/>} />
            <Route path = '/dashboard' exact element = {<Dashboard/>} />
        </Routes>
        </BrowserRouter>
    </div>
}

export default App