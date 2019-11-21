import React from "react";
import * as Setting from "./Setting";
import {Layer, Line, Stage} from "react-konva";
import {Alert, Button, Card, Col, Progress, Row, Switch, Table, Tag, Typography} from "antd";
import WrappedNormalLoginForm from "./Login";

const {Text} = Typography;

class TestPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      status: false,
      events: [],
      isBackground: false,
      sessionId: "",
      isBot: -1,
      rule: "",
      ruleStart: -1,
      ruleEnd: -1,
      traces: [],
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

  uploadTrace(action = 'upload') {
    const width = document.body.scrollWidth;
    const height = document.body.scrollHeight;
    const trace = {url: window.location.pathname, width: width, height: height, events: this.state.events};

    fetch(`${Setting.ServerUrl}/api/${action}-trace?sessionId=${this.state.sessionId}`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(trace)
    }).then(response => response.json())
        .then(res => {
          this.setState({
            isBot: res.isBot,
            rule: res.rule,
            ruleStart: res.ruleStart,
            ruleEnd: res.ruleEnd,
            traces: res.traces,
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

    this.state.traces = [];
    this.setState({
      traces: this.state.traces
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

    let p = {timestamp: e.timeStamp, x: e.pageX, y: e.pageY};
    this.state.events.push(p);
    if (this.state.traces.length === 0) {
      const width = document.body.scrollWidth;
      const height = document.body.scrollHeight;
      this.state.traces = [{url: window.location.pathname, width: width, height: height, isBot: -1, events: []}];
      this.setState({
        traces: this.state.traces
      });
    }
    this.state.traces[0].events.push(p);

    this.setState({
      events: this.state.events
    });
  };

  renderResult() {
    if (!this.state.status) {
      return (
          <Alert message="Server Offline" description="Server Offline" type="Informational" showIcon banner/>
      )
    } else {
      if (this.state.isBot === 1) {
        return (
            <Alert message="You Are Bot" description={this.state.rule} type="error" showIcon banner/>
        )
      } else if (this.state.isBot === 0) {
        return (
            <Alert message="You Are Human" description="You Are Human" type="success" showIcon banner/>
        )
      } else {
        return (
            <Alert message="No Mouse Trace" description="No Mouse Trace" type="warning" showIcon banner/>
        )
      }
    }
  }

  renderTraceTable(title, traces) {
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
      },
      {
        title: 'Is Bot',
        dataIndex: 'isBot',
        key: 'isBot',
      }
    ];

    return (
        <div>
          <Table columns={columns} dataSource={traces} size="small" bordered
                 title={() => <div><Text>Traces for: </Text><Tag color="#108ee9">{title}</Tag></div>}/>
        </div>
    );
  }

  renderEventTable(title, events) {
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
          <Table columns={columns} dataSource={events.slice(-6)} size="small" bordered
                 title={() => <div><Text>Events for: </Text><Tag color="#108ee9">{title}</Tag></div>}/>
        </div>
    );
  }

  getPoints() {
    if (this.state.traces.length !== 0) {
      return this.getPointsFromTrace(this.state.traces[0]);
    } else {
      return [];
    }
  }

  getPointsFromTrace(trace) {
    let points = [];
    trace.events.forEach(function (event) {
      points.push(event.x);
      points.push(event.y);
    });
    return points;
  }

  renderCanvas() {
    const width = document.body.scrollWidth * 0.49;
    const height = document.body.scrollHeight * 0.49;

    if (!this.state.isBackground) {
      return (
          <Stage width={width} height={height}
                 style={{border: '1px solid rgb(232,232,232)', marginLeft: '5px', marginRight: '5px'}}>
            <Layer>
              <Line
                  x={0}
                  y={0}
                  points={this.getPoints()}
                  stroke="black"
                  scaleX={0.49}
                  scaleY={0.49}
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
    } else {
      return (
          <Stage width={width} height={height}
                 style={{border: '1px solid rgb(232,232,232)', marginLeft: '5px', marginRight: '5px', background: 'rgb(245,245,245)'}}>
          </Stage>
      )
    }
  }

  onChange(checked) {
    this.setState({
      isBackground: checked
    });
  }

  renderProgress() {
    if (!this.state.isBackground) {
      return <Progress percent={this.state.events.length * 2} status="active"/>
    } else {
      return <Progress percent={0} status="exception"/>
    }
  }

  render() {
    return (
        <div>
          {this.renderProgress()}
          {this.renderResult()}
          <Row>
            <Col span={6}>
              {
                !this.state.isBackground? this.renderTraceTable(this.state.sessionId, this.state.traces) : this.renderTraceTable('', [])
              }
              <Row>
                <Col span={16}>
                  Background recording: <Switch onChange={this.onChange.bind(this)} />
                </Col>
                <Col span={8}>
                  <Button type="danger" block onClick={this.clearTrace.bind(this)}>Clear Traces</Button>
                </Col>
              </Row>
              {
                !this.state.isBackground? this.renderEventTable(window.location.pathname, this.state.events) : this.renderEventTable('', [])
              }
            </Col>
            <Col span={12}>
              {this.renderCanvas()}
            </Col>
            <Col span={6}>
              <Card title="Beat Me !" extra={<a href="#">More</a>}>
                <WrappedNormalLoginForm/>
              </Card>
            </Col>
          </Row>
        </div>
    );
  }

}

export default TestPage;
