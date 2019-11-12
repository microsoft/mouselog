import React from 'react';
import logo from './logo.svg';
import './App.css';
import Badge from "react-bootstrap/Badge";
import * as Setting from "./Setting";
import Navbar from "react-bootstrap/Navbar";
import {Nav} from "react-bootstrap";

import {Switch, Route} from 'react-router-dom'
import TestPage from "./TestPage";
import DashboardPage from "./DashboardPage";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      status: false,
      sessionId: "",
    };
  }

  componentDidMount() {
    fetch(`${Setting.ServerUrl}/api/get-session-id`, {
      method: "GET",
      credentials: "include"
    }).then(res => res.json())
        .then(res => {
          this.setState({
            sessionId: res,
            status: true
          });
        })
        .catch(error => {
          this.setState({
            status: false
          });
        });
  }

  render() {
    Setting.initServerUrl();

    return (
        <div className="App fill-window" onMouseMove={(e) => Setting.mouseMove(e)}>
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="#home">
              <img
                  alt=""
                  src={logo}
                  width="30"
                  height="30"
                  className="d-inline-block align-top"
              />{' '}
              MouseLog
            </Navbar.Brand>
            <Nav className="mr-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/dashboard">Dashboard</Nav.Link>
            </Nav>
            <Navbar.Toggle/>
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text>
                Server Status: {this.state.status ? <Badge variant="success">On</Badge> :
                  <Badge variant="danger">Off</Badge>}
              </Navbar.Text>
              <Navbar.Text>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </Navbar.Text>
              <Navbar.Text>
                Your Session ID: <Badge
                  variant="secondary">{this.state.sessionId !== '' ? this.state.sessionId : 'NULL'}</Badge>
              </Navbar.Text>
            </Navbar.Collapse>
          </Navbar>
          <Switch>
            <Route exact path="/" component={TestPage}/>
            <Route path="/dashboard/" component={DashboardPage}/>
          </Switch>
        </div>
    );
  }

}

export default App;
