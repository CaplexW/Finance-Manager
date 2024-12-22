import React from "react";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import NavBar from "./components/UI/NavBar";
import { Route, Routes } from "react-router-dom";
import Login from "./layouts/login";
import MainPage from "./layouts/mainPage";
import LogOut from "./layouts/logOut";
import Operations from "./layouts/operations";

export default function App() {
return ( 
  <div className="App" style={{ height: '100vh', width: '99vw' }}>
    <ToastContainer />
    <NavBar />
    <Routes>
      <Route Component={MainPage} index />
      <Route Component={Login} path="/login/:register?" />
      <Route Component={LogOut} path="/logout" />
      <Route Component={Operations} path="/operations" />
    </Routes>
  </div>
 ); 
};