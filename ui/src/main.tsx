import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import App from "./App.jsx";
import Home from "./Home.jsx";
import CriteriaPage from "./CriteriaPage";
import AllPage from "./AllPage.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { assessmentFocusSlice } from "./redux/AssessmentReducer.js";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const store = configureStore({
  reducer: assessmentFocusSlice.reducer,
}); // Create Redux store

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "criteria/:criteriaName",
        element: <CriteriaPage />,
      },
      {
        path: "/all",
        element: <AllPage />,
      },
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <RouterProvider router={router} />
      </LocalizationProvider>
    </Provider>
  </React.StrictMode>
);
