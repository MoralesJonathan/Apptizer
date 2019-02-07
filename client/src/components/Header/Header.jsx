import React, { Component } from "react";
import { Navbar, Dropdown, ButtonGroup, Button } from "react-bootstrap";
import axios from 'axios';
import dashboardRoutes from "../../routes/dashboard.jsx";

class Header extends Component {
  constructor(props) {
    super(props);
    this.mobileSidebarToggle = this.mobileSidebarToggle.bind(this);
    this.state = {
      sidebarExists: false
    };
  }
  deployApp = () => {
    let config = {
      "apiEndpoint": "cjrmt6136000q01qucst4y3dy",
      state: {}
    };
    config.state.restaurantName = document.getElementById('formBasicTitle').value;
    config.appName = document.getElementById('formBasicName').value;
    config.appIdentifier = `com.${config.state.restuarantName}.app`;
    axios
      .post('/api/deploy/android', {
        body: config,
      })
      .then(res => {
        console.log(res);
        axios.get(res.data);
      });
  }
  mobileSidebarToggle(e) {
    if (this.state.sidebarExists === false) {
      this.setState({
        sidebarExists: true
      });
    }
    e.preventDefault();
    document.documentElement.classList.toggle("nav-open");
    var node = document.createElement("div");
    node.id = "bodyClick";
    node.onclick = function () {
      this.parentElement.removeChild(this);
      document.documentElement.classList.toggle("nav-open");
    };
    document.body.appendChild(node);
  }
  render() {
    return (
      <Navbar bg="white" >
        <Navbar.Brand href="#home">New Restaurant App Creator</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Dropdown as={ButtonGroup}>
            <Button variant="success" onClick={this.deployApp}>Deploy apps</Button>

            <Dropdown.Toggle split variant="success" id="dropdown-split-basic" />

            <Dropdown.Menu>
              <Dropdown.Item hred="#/action-1">Deploy only iOS</Dropdown.Item>
              <Dropdown.Item hred="#/action-2">Deploy only Android</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Header;
