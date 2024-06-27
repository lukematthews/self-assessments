import { Outlet } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import SideNavigation from "./SideNavigation";
import { purple } from "@mui/material/colors";

function App() {

  return (
    <Container>
      <Row style={{ backgroundColor: purple[800], color: "white" }}>
        <Col lg="12">
          <a className="h1" href="/" style={{ textDecoration: "none" }}>
            Self Assessments
          </a>
        </Col>
      </Row>
      <Row>
        <Col lg="3" style={{ backgroundColor: purple[800], color: "white" }}>
          <SideNavigation></SideNavigation>
        </Col>
        <Col lg="9">
          <Container className="pt-2 px-0">
            <Outlet></Outlet>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
