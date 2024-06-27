import React from "react";
import ReactDOM from "react-dom/client";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import App from "./App.jsx";
import Home from "./Home.jsx";
import CriteriaPage from "./CriteriaPage";
import AllPage from "./AllPage.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
// import store from './redux/store';
// import { Provider } from 'react-redux';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children: [{
      path: "criteria/:criteriaName",
      element: <CriteriaPage></CriteriaPage>
    },
    {
      path: "/all",
      element: <AllPage></AllPage>
    },
    {
      path: "/",
      element: <Home></Home>
    }]
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <Provider store={store}> */}
      <RouterProvider router={router}></RouterProvider>
    {/* </Provider> */}
  </React.StrictMode>
);
