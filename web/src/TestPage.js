import React from "react";
import * as Setting from "./Setting";
import Alert from "react-bootstrap/Alert";
import {Layer, Line, Stage} from "react-konva";
import Button from "react-bootstrap/Button";
import ProgressBar from "react-bootstrap/ProgressBar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";

class TestPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      status: false,
      events: [],
      sessionId: "",
      isBot: -1,
      rule: "",
      ruleStart: -1,
      ruleEnd: -1,
      data: [],
    };
  }

  componentDidMount() {
    Setting.setMouseMove(this, this.mousemove);

    fetch(`${Setting.ServerUrl}/api/get-session-id`, {
      method: "GET",
      credentials: "include"
    }).then(res => res.json())
        .then(res => {
          this.setState({
            sessionId: res,
            status: true
          });

          this.uploadTrace();
        })
        .catch(error => {
          this.setState({
            status: false
          });
        });
  }

  getPoints() {
    let points = [];
    if (this.state.data.length !== 0) {
      this.state.data[0].events.forEach(function (event) {
        points.push(event.x);
        points.push(event.y);
      });
    }
    return points;
  }

  uploadTrace(action = 'upload') {
    const width = document.body.scrollWidth;
    const height = document.body.scrollHeight;
    const data = {url: window.location.pathname, width: width, height: height, events: this.state.events};

    fetch(`${Setting.ServerUrl}/api/${action}-trace?sessionId=${this.state.sessionId}`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(data)
    }).then(response => response.json())
        .then(res => {
          this.setState({
            isBot: res.isBot,
            rule: res.rule,
            ruleStart: res.ruleStart,
            ruleEnd: res.ruleEnd,
            data: res.data,
            status: true
          });
        })
        .catch(error => {
          this.setState({
            status: false
          });
        });
  }

  clearTrace() {
    this.uploadTrace('clear');

    this.state.events = [];
    this.setState({
      events: this.state.events
    });

    this.state.data = [];
    this.setState({
      data: this.state.data
    });
  }

  mousemove(e) {
    if (this.state.events.length === 50) {
      this.uploadTrace();

      this.state.events = [];
      this.setState({
        events: this.state.events
      });
    }

    let p = {no: this.state.events.length, timestamp: e.timeStamp, x: e.pageX, y: e.pageY};
    this.state.events.push(p);
    let p2 = {timestamp: e.timeStamp, x: e.pageX, y: e.pageY};
    if (this.state.data.length === 0) {
      const width = document.body.scrollWidth;
      const height = document.body.scrollHeight;
      this.state.data = [{url: window.location.pathname, width: width, height: height, events: []}];
      this.setState({
        data: this.state.data
      });
    }
    this.state.data[0].events.push(p2);

    this.setState({
      events: this.state.events
    });

    // draw(e);
  };

  renderResult() {
    if (!this.state.status) {
      return (
          <Alert variant="secondary">
            <Alert.Heading>Server offline</Alert.Heading>
          </Alert>
      )
    } else {
      if (this.state.isBot === 1) {
        return (
            <Alert variant="danger">
              <Alert.Heading>
                You Are Bot
                &nbsp;&nbsp;
                <Button variant="outline-secondary" onClick={this.clearTrace.bind(this)}>Clear Traces</Button>
              </Alert.Heading>
              <p>
                {this.state.rule}
              </p>
            </Alert>
        )
      } else if (this.state.isBot === 0) {
        return (
            <Alert variant="success">
              <Alert.Heading>
                You Are Human
                &nbsp;&nbsp;
                <Button variant="outline-secondary" onClick={this.clearTrace.bind(this)}>Clear Traces</Button>
              </Alert.Heading>
            </Alert>
        )
      } else {
        return (
            <Alert variant="warning">
              <Alert.Heading>
                No Mouse Trace
                &nbsp;&nbsp;
                <Button variant="outline-secondary" onClick={this.clearTrace.bind(this)}>Clear Traces</Button>
              </Alert.Heading>
            </Alert>
        )
      }
    }
  }

  renderCanvas() {
    const width = document.body.scrollWidth;
    const height = document.body.scrollHeight;
    return (
        <Stage width={width / 2} height={height / 2}>
          <Layer>
            <Line
                x={0}
                y={0}
                points={this.getPoints()}
                stroke="black"
                scaleX={0.5}
                scaleY={0.5}
            />
            {
              (this.state.ruleStart !== -1 && this.state.ruleEnd !== -1) ? <Line
                      x={0}
                      y={0}
                      points={this.getPoints().slice(this.state.ruleStart * 2, this.state.ruleEnd * 2)}
                      stroke="red"
                      strokeWidth={5}
                      scaleX={0.5}
                      scaleY={0.5}
                  />
                  : null
            }
          </Layer>
        </Stage>
    )
  }

  render() {
    Setting.initServerUrl();

    return (
        <div>
          <ProgressBar animated now={this.state.events.length * 2} label={`${this.state.events.length * 2}%`}/>
          {this.renderResult()}
          <Container fluid>
            <Row>
              <Col>
                <Table striped bordered hover size="sm">
                  <thead>
                  <tr>
                    <th>#</th>
                    <th>Url</th>
                    <th>Size</th>
                    <th>Count</th>
                  </tr>
                  </thead>
                  <tbody>
                  {
                    this.state.data.map(function (e, i) {
                      return (
                          <tr>
                            <td>{i}</td>
                            <td>{e.url}</td>
                            <td>{`(${e.width}, ${e.height})`}</td>
                            <td>{e.events.length}</td>
                          </tr>
                      )
                    })
                  }
                  </tbody>
                </Table>
                <Table striped bordered hover size="sm">
                  <thead>
                  <tr>
                    <th>#</th>
                    <th>Timestamp (seconds)</th>
                    <th>(X, Y)</th>
                  </tr>
                  </thead>
                  <tbody>
                  {
                    this.state.events.slice(-10).map(function (e, i) {
                      return (
                          <tr>
                            <td>{e.no}</td>
                            <td>{e.timestamp / 100}</td>
                            <td>{`(${e.x}, ${e.y})`}</td>
                          </tr>
                      )
                    })
                  }
                  </tbody>
                </Table>
              </Col>
              <Col>
                {this.renderCanvas()}
              </Col>
              <Col>
                <Card>
                  <Card.Header>Beat Me !</Card.Header>
                  <Card.Body>
                    <Form>
                      <Form.Group controlId="formBasicEmail">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="username" placeholder="Enter Username"/>
                        <Form.Text className="text-muted">
                          We'll never share your username with anyone else.
                        </Form.Text>
                      </Form.Group>

                      <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password"/>
                      </Form.Group>
                      <Form.Group controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="Agree our terms of service."/>
                      </Form.Group>
                      <Button variant="primary" type="submit">
                        Sign Up
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
    );
  }

}

export default TestPage;
