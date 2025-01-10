import React, { useEffect } from "react";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import NavBar from "./components/UI/NavBar";
import { Route, Routes } from "react-router-dom";
import Login from "./layouts/login";
import MainPage from "./layouts/mainPage";
import LogOut from "./layouts/logOut";
import Operations from "./layouts/operations";
import { useDispatch, useSelector } from "react-redux";
import { getIconsLoadStatus, loadIcons } from "./store/icons";
import { getUserDataStatus, loadUserData } from "./store/user";
import { getOperationsLoadStatus, loadOperations } from "./store/operations";
import { getCategoriesLoadStatus, loadCategories } from "./store/categories";

export default function App() {
  const dispatch = useDispatch();

  const userDataIsLoaded = useSelector(getUserDataStatus());
  const operationsIsLoaded = useSelector(getOperationsLoadStatus());
  const categoriesIsLoaded = useSelector(getCategoriesLoadStatus());
  const iconsIsLoaded = useSelector(getIconsLoadStatus());

  const dataIsLoaded = (
    userDataIsLoaded
    && operationsIsLoaded
    && categoriesIsLoaded
    && iconsIsLoaded
  );

  useEffect(loadData, [dataIsLoaded]);

  function loadData() {
    if (dataIsLoaded) return;

    if (!operationsIsLoaded) dispatch(loadOperations());
    if (!categoriesIsLoaded) dispatch(loadCategories());
    if (!iconsIsLoaded) dispatch(loadIcons());
    if (!userDataIsLoaded) dispatch(loadUserData());
  }
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