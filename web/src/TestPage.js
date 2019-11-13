import React from "react";
import * as Setting from "./Setting";
import {Layer, Line, Stage} from "react-konva";
import {Alert, Button, Card, Col, Progress, Row, Table} from "antd";
import WrappedNormalLoginForm from "./Login";

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
        <Alert message="Server Offline" description="Server Offline" type="Informational" showIcon banner />
      )
    } else {
      if (this.state.isBot === 1) {
        return (
          <Alert message="You Are Bot" description={this.state.rule} type="error" showIcon banner />
        )
      } else if (this.state.isBot === 0) {
        return (
          <Alert message="You Are Human" description="You Are Human" type="success" showIcon banner />
        )
      } else {
        return (
          <Alert message="No Mouse Trace" description="No Mouse Trace" type="warning" showIcon banner />
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

  renderSessionTable() {
    const columns = [
      {
        title: 'URL',
        dataIndex: 'url',
        key: 'url',
      },
      {
        title: 'Width',
        dataIndex: 'width',
        key: 'width',
      },
      {
        title: 'Height',
        dataIndex: 'height',
        key: 'height',
      },
      {
        title: 'Event Count',
        dataIndex: 'events.length',
        key: 'count',
      }
    ];

    return (
      <div>
        <Table columns={columns} dataSource={this.state.data} size="small" bordered title={() => 'Traces: ' + this.state.sessionId} />
      </div>
    );
  }

  renderPointTable() {
    const columns = [
      {
        title: 'Timestamp (milliseconds)',
        dataIndex: 'timestamp',
        key: 'url',
      },
      {
        title: 'X',
        dataIndex: 'x',
        key: 'x',
      },
      {
        title: 'Y',
        dataIndex: 'y',
        key: 'y',
      }
    ];

    return (
      <div>
        <Table columns={columns} dataSource={this.state.events.slice(-6)} size="small" bordered title={() => 'Points: ' + window.location.pathname} />
      </div>
    );
  }

  render() {
    return (
        <div>
          <Progress percent={this.state.events.length * 2} status="active" />
          {this.renderResult()}
          <Row>
            <Col span={6}>
              {
                this.renderSessionTable()
              }
              <Button type="danger" block onClick={this.clearTrace.bind(this)}>Clear Traces</Button>
              {
                this.renderPointTable()
              }
            </Col>
            <Col span={12}>
              {this.renderCanvas()}
            </Col>
            <Col span={6}>
              <Card title="Beat Me !" extra={<a href="#">More</a>} >
                <WrappedNormalLoginForm />
              </Card>
            </Col>
          </Row>
        </div>
    );
  }

}

export default TestPage;
