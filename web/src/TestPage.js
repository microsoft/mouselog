import React from "react";
import * as Setting from "./Setting";
import {Alert, Button, Card, Col, Progress, Row, Switch, Table, Tag, Typography} from "antd";
import WrappedNormalLoginForm from "./Login";
import * as Shared from "./Shared";

const {Text} = Typography;

class TestPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      status: false,
      events: [],
      isBackground: false,
      eventBuckets: Array(11).fill(0),
      eventCount: 0,
      speed: 0,
      payloadSize: 0,
      sessionId: "",
      traces: [],
      trace: null,
    };
  }

  componentDidMount() {
    Setting.setMouseHandler(this, this.mouseHandler);

    setInterval(() => {
      let eventBuckets = this.state.eventBuckets;
      eventBuckets = eventBuckets.slice(1);
      eventBuckets.push(this.state.eventCount);

      this.setState({
        eventBuckets: eventBuckets,
        speed: eventBuckets[10] - eventBuckets[0],
      })
    }, 100);

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

  getByteCount(s) {
    let count = 0, stringLength = s.length, i;
    s = String(s || "");
    for (i = 0; i < stringLength; i++) {
      const partCount = encodeURI(s[i]).split("%").length;
      count += partCount === 1 ? 1 : partCount - 1;
    }
    return count;
  }

  uploadTrace(action = 'upload') {
    const width = document.body.scrollWidth;
    const height = document.body.scrollHeight;
    const trace = {id: window.location.pathname, width: width, height: height, events: this.state.events};
    const traceStr = JSON.stringify(trace);

    if (this.state.events.length === 50) {
      this.setState({
        payloadSize: this.getByteCount(traceStr)
      });
    }

    fetch(`${Setting.ServerUrl}/api/${action}-trace?sessionId=${this.state.sessionId}`, {
      method: "POST",
      credentials: "include",
      body: traceStr
    }).then(response => response.json())
        .then(res => {
          this.setState({
            traces: res.traces,
            trace: res.traces[0],
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
    this.state.trace = null;
    this.setState({
      traces: this.state.traces,
      trace: this.state.trace
    });
  }

  simulateMouse() {
    // let mouseMoveEvent = document.createEvent("MouseEvents");
    // mouseMoveEvent.initMouseEvent(
    //     "mousemove", //event type : click, mousedown, mouseup, mouseover, mousemove, mouseout.
    //     true, //canBubble
    //     false, //cancelable
    //     window, //event's AbstractView : should be window
    //     1, // detail : Event's mouse click count
    //     50, // screenX
    //     50, // screenY
    //     50, // clientX
    //     50, // clientY
    //     false, // ctrlKey
    //     false, // altKey
    //     false, // shiftKey
    //     false, // metaKey
    //     0, // button : 0 = click, 1 = middle button, 2 = right button
    //     null // relatedTarget : Only used with some event types (e.g. mouseover and mouseout). In other cases, pass null.
    // );

    let e = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
      clientX: 165,
      clientY: 430,
    });

    let element = document.getElementById("mouseArea");
    element.dispatchEvent(e);
  }

  mouseHandler(type, e) {
    let eventCount = this.state.eventCount;
    eventCount += 1;
    this.setState({
      eventCount: eventCount
    });

    if (this.state.events.length === 50) {
      this.uploadTrace();

      this.state.events = [];
      this.setState({
        events: this.state.events
      });
    }

    let p = {timestamp: Math.trunc(e.timeStamp), type: type, x: e.pageX, y: e.pageY, isTrusted: e.isTrusted};
    this.state.events.push(p);
    if (this.state.trace === null) {
      const width = document.body.scrollWidth;
      const height = document.body.scrollHeight;
      this.state.trace = {id: window.location.pathname, width: width, height: height, isBot: -1, events: []};
      this.setState({
        trace: this.state.trace
      });
    }
    this.state.trace.events.push(p);

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
      if (this.state.trace === null || this.state.trace.isBot === -1) {
        return (
            <Alert message="No Mouse Trace" description="No Mouse Trace" type="warning" showIcon banner/>
        )
      } else if (this.state.trace.isBot === 1) {
        return (
            <Alert message="You Are Bot" description={this.state.trace.reason} type="error" showIcon banner/>
        )
      } else if (this.state.trace.isBot === 0) {
        return (
            <Alert message="You Are Human" description="You Are Human" type="success" showIcon banner/>
        )
      }
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
                !this.state.isBackground ? Shared.renderTraceTable(this.state.sessionId, this.state.traces, null) : Shared.renderTraceTable('', [], null)
              }
              <Row>
                <Col span={12}>
                  {/*<div><Text>Events for: </Text><Tag color="#108ee9">{this.state.speed}</Tag></div>*/}
                  <Text>Events/s: </Text>
                  <Progress type="circle" percent={this.state.speed} format={percent => `${percent}`} width={80}/>
                </Col>
                <Col span={12}>
                  <div><Text>Sent payload size: </Text><Tag color="#108ee9">{this.state.payloadSize}</Tag>Bytes/req</div>
                </Col>
                <Text>&nbsp;</Text>
              </Row>
              <Row>
                <Col span={12}>
                  Background recording: <Switch onChange={this.onChange.bind(this)}/>
                </Col>
                <Col span={12}>
                  <Button type="danger" block onClick={this.clearTrace.bind(this)}>Clear Traces</Button>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Button type="primary" block onClick={this.simulateMouse.bind(this)}>Perform Fake Click</Button>
                </Col>
                <Col span={12}>

                </Col>
              </Row>
              <Row>
                {
                  !this.state.isBackground ? Shared.renderEventTable(window.location.pathname, this.state.events.slice(-6)) : Shared.renderEventTable('', [])
                }
              </Row>
            </Col>
            <Col span={12}>
              {
                Shared.renderCanvas(this.state.trace, Shared.getSizeSmall(this.state.trace), this.state.isBackground)
              }
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
