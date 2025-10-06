import { Navbar, Nav, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./NavigationBar.css";

const NavigationBar = () => {
  const navigate = useNavigate();

  return (
    <Navbar expand="lg" sticky="top" className="custom-navbar">
      <Container>
        <img 
          src="/AURA.png" 
          alt="Home" 
          onClick={() => navigate('/')}
          className="navbar-logo"
          style={{ cursor: 'pointer', height: '50px' }}
        />
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/* You can add other nav items here if needed */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;