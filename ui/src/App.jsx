import { Outlet } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

function App() {
  return (<Container>
    <Row className="mb-5">
      <Col lg="12">
        <a className="h1" href="/" style={{ textDecoration: "none" }}>
          Self Assessments
        </a>
      </Col>
    </Row>
    <Row>
      <Col>
        <Outlet></Outlet>
      </Col>
    </Row>
  </Container>);
}

export default App;
