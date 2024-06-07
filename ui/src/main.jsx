import React from "react";
import ReactDOM from "react-dom/client";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import App from "./App.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Container>
      <Row className="mb-5">
        <Col lg="12">
          <a className="h1" href="/" style={{textDecoration:"none"}}>
            Self Assessments
          </a>
        </Col>
      </Row>
      <Row>
        <Col>
          <RouterProvider router={router}></RouterProvider>
        </Col>
      </Row>
    </Container>
  </React.StrictMode>
);
