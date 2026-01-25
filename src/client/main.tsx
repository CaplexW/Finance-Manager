import 'bootstrap/dist/css/bootstrap.css';
import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
// import createStore, { store } from "./app/store/createStore";
import App from "./app/App";
import { store } from './app/store/createStore';

// const store = createStore();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);

document.body.oncontextmenu = () => false;




