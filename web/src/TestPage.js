import React from "react";
import * as Setting from "./Setting";
import {Alert, Button, Card, Col, Progress, Row, Switch, Table, Tag, Typography} from "antd";
import WrappedNormalLoginForm from "./Login";
import * as Shared from "./Shared";
import Canvas from "./Canvas";
import * as Backend from "./Backend";


const {Text} = Typography;

class TestPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      status: false,
      events: [],
      pageLoadTime: new Date(),
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

    Backend.getSessionId()
    .then(res => res.json())
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
    const trace = {id: window.location.pathname, width: width, height: height, pageLoadTime: this.state.pageLoadTime, label: -1, guess: -1, events: this.state.events};
    const traceStr = JSON.stringify(trace);

    if (this.state.events.length === 50) {
      this.setState({
        payloadSize: this.getByteCount(traceStr)
      });
    }


    Backend.trace(action, this.state.sessionId, traceStr)
    .then(
      response => response.json()
    ).then(
      res => {
        this.setState({
          traces: res.traces,
          trace: res.traces.length === 0 ? null : res.traces[0],
          status: true
        });
        
        if (res.traces.length !== 0) {
          this.setState({
            pageLoadTime: this.parseDateString(res.traces[0].pageLoadTime),
          });
        }
      }
    ).catch(error => {
      this.setState({
        status: false
      })
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
      trace: this.state.trace,
      pageLoadTime: new Date(),
    });
  }

  simulateMouse() {
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

  getButton(button) {
    if (button === '2') {
      return "Right";
    } else {
      return "";
    }
  }

  parseDateString(date) {
    return new Date(Date.parse(date));
  }

  getRelativeTimestampInSeconds() {
    let diff = new Date() - this.state.pageLoadTime;
    return Math.trunc(diff) / 1000;
  }

  mouseHandler(type, e) {
    // PC's Chrome on Mobile mode can still receive "contextmenu" event with zero X, Y, so we ignore these events.
    if (e.type === 'contextmenu' && e.pageX === 0 && e.pageY === 0) {
      return;
    }

    // Don't track our own buttons.
    if (type === 'click' && (e.target.textContent === 'Clear Traces' || e.target.textContent === 'Perform Fake Click')) {
      return;
    }

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

    let x = e.pageX;
    let y = e.pageY;
    if (x === undefined) {
      x = e.changedTouches[0].pageX;
      y = e.changedTouches[0].pageY;
    }

    let p = {timestamp: this.getRelativeTimestampInSeconds(), type: type, x: x, y: y, button: this.getButton(e.button)};
    // let p = {timestamp: Math.trunc(e.timeStamp), type: type, x: e.pageX, y: e.pageY, isTrusted: e.isTrusted};
    this.state.events.push(p);
    if (this.state.trace === null) {
      const width = document.body.scrollWidth;
      const height = document.body.scrollHeight;
      this.state.trace = {id: window.location.pathname, width: width, height: height, label: -1, guess: -1, events: []};
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
      if (this.state.trace === null || this.state.trace.guess === -1) {
        return (
            <Alert message="No Mouse Trace" description="No Mouse Trace" type="warning" showIcon banner/>
        )
      } else if (this.state.trace.guess === 1) {
        return (
            <Alert message="You Are Bot" description={this.state.trace.reason} type="error" showIcon banner/>
        )
      } else if (this.state.trace.guess === 0) {
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
              <Canvas trace={this.state.trace} size={Shared.getSizeSmall(this.state.trace)} isBackground={this.state.isBackground} />
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
