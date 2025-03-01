import React, { useEffect } from "react";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import NavBar from "./components/UI/NavBar";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./layouts/loginPage";
import MainPage from "./layouts/mainPage";
import LogOut from "./layouts/logOut";
import OperationsPage from "./layouts/operationsPage";
import { useDispatch, useSelector } from "react-redux";
import { getIconsLoadStatus, loadIcons } from "./store/icons";
import { getLoginStatus, getUserDataStatus, loadUserData } from "./store/user";
import { getOperationsLoadStatus, loadOperations } from "./store/operations";
import { getCategoriesLoadStatus, loadCategories } from "./store/categories";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from "../../server/utils/console/showElement";
import ProtectedRoute from "./components/routes/protectedRoute";
import AnalyticsPage from "./layouts/analyticsPage";

export default function App() {
  const dispatch = useDispatch();

  const userDataIsLoaded = useSelector(getUserDataStatus());
  const operationsIsLoaded = useSelector(getOperationsLoadStatus());
  const categoriesIsLoaded = useSelector(getCategoriesLoadStatus());
  const iconsIsLoaded = useSelector(getIconsLoadStatus());
  const isLoggedIn = useSelector(getLoginStatus());

  const dataIsLoaded = (
    userDataIsLoaded
    && operationsIsLoaded
    && categoriesIsLoaded
    && iconsIsLoaded
  );

  useEffect(loadData, [dataIsLoaded, isLoggedIn]);

  function loadData() {
    if (dataIsLoaded) return;

    if (!operationsIsLoaded) dispatch(loadOperations());
    if (!categoriesIsLoaded) dispatch(loadCategories());
    if (!iconsIsLoaded) dispatch(loadIcons());
    if (!userDataIsLoaded) dispatch(loadUserData());
  }
  if (!dataIsLoaded && isLoggedIn) return;
  return (
    <div className="App" style={{ height: '100vh' }}>
      <ToastContainer />
      <NavBar />
      <Routes>
        <Route element={<ProtectedRoute isAuthenticated={!isLoggedIn} redirectPath="/analytics" />}>
          <Route Component={MainPage} index />
          <Route Component={LoginPage} path="/login/:register?" />
        </Route>
        <Route element={<ProtectedRoute isAuthenticated={isLoggedIn} />}>
          <Route Component={AnalyticsPage} path="/analytics" />
          <Route Component={OperationsPage} path="/operations" />
        </Route>
        <Route Component={LogOut} path="/logout" />
      </Routes>
    </div>
  );
};