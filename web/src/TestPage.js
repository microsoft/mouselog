/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 */

import React from "react";
import * as Setting from "./Setting";
import {Alert, Button, Card, Col, Input, Progress, Row, Select, Switch, Tag, Typography} from "antd";
import * as Shared from "./Shared";
import Canvas from "./Canvas";
import EventSelectionCheckBox from "./EventSelectionCheckBox"
import * as Backend from "./Backend";
import TraceTable from "./TraceTable";
import {isLocalStorageAvailable} from "./utils";

const {Text} = Typography;

const allTargetEvents = [
  "mousemove",
  "mousedown",
  "mouseup",
  "mouseclick",
  "dblclick",
  "contextmenu",
  "wheel",
  "torchstart",
  "touchmove",
  "touchend"
];

const defaultTargetEvents = [
  "mousemove",
  "mousedown",
  "mouseup",
  "mouseclick",
  "dblclick",
  "contextmenu",
  "wheel",
  "torchstart",
  "touchmove",
  "touchend"
];

class TestPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      status: false,
      pageLoadTime: new Date(),
      isBackground: false,
      events: [],
      eventBuckets: Array(11).fill(0),
      speed: 0,
      payloadSize: 0,
      sessionId: "",
      onLoading: true,
    };
    // this.events is used as a buffer for rendering progress bar. It only contains no more than 50 events.
    this.events = [];
    // this.trace indicates the information of the current page, including all the mouse events.
    this.trace = this.newTrace();
    this.traces = [];
    this.targetEvents = defaultTargetEvents;
  }

  componentDidMount() {
    Setting.setMouseHandler(this, this.mouseHandler);

    // Update speed property every 0.1 s
    setInterval(() => {
      let eventBuckets = this.state.eventBuckets;
      eventBuckets = eventBuckets.slice(1);
      eventBuckets.push(this.events.length);

      this.setState({
        eventBuckets: eventBuckets,
        speed: eventBuckets[10] - eventBuckets[0],
      })
    }, 100);

    this.trace.events = this.loadTraceFromLocal();

    // Set the sessionId.
    this.setState({
      sessionId: Setting.getSessionId(),
      status: true
    })

    // Load data here

    this.setState({
      onLoading: false
    })
  }

  eventsEncoder(events) {
    // Convert event object to array
    // {id:id,timestamp:t,type:type,x:x,y:y,button:btn} => [id,type,t,x,y,btn]
    let t = []
    events.forEach(evt => {
      t.push([evt.id, allTargetEvents.indexOf(evt.type), evt.timestamp, evt.x, evt.y, evt.button]);
    })
    return JSON.stringify(t);
  }

  eventsDecoder(str) {
    // Convert arry to event object
    // [id,type,t,x,y,btn]=>{id:id,timestamp:t,type:type,x:x,y:y,button:btn}
    let t = JSON.parse(str);
    let events = [];
    t.forEach(item => {
      events.push({
        id: parseInt(item[0]),
        timestamp: parseFloat(item[2]),
        type: allTargetEvents[item[1]],
        x: parseInt(item[3]),
        y: parseInt(item[4]),
        button: item[5]
      })
    })
    return events;
  }

  loadTraceFromLocal() {
    if (!isLocalStorageAvailable) {
      console.log("LocalStorage is not available!");
      return [];
    }
    let str = localStorage.getItem("traceDataCache");
    return str ? this.eventsDecoder(str) : [];  // Return an empty array if no cache.
  }

  saveTraceToLocal() {
    if (!isLocalStorageAvailable) {
      return;
    }
    let dataStr = this.eventsEncoder(this.trace.events);
    localStorage.setItem("traceDataCache", dataStr);
  }

  removeTraceFromLocal() {
    if (isLocalStorageAvailable) {
      localStorage.removeItem("traceDataCache");
    }
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

  getHostname() {
    return window.location.hostname;
  }

  getPathname() {
    return window.location.pathname;
  }

  newTrace() {
    return {
      id: '0',
      url: this.getHostname(),
      path: this.getPathname(),
      width: document.body.scrollWidth,
      height: document.body.scrollHeight,
      pageLoadTime: this.state.pageLoadTime,
      label: -1,
      guess: -1,
      events: [],
    };
  }

  uploadTrace(action = 'upload') {
    const width = document.body.scrollWidth;
    const height = document.body.scrollHeight;
    let trace = this.newTrace();
    trace.events = this.events;
    const traceStr = JSON.stringify(trace);

    if (this.events.length === 50) {
      this.setState({
        payloadSize: this.getByteCount(traceStr)
      });
    }

    Backend.uploadTrace(action, Setting.getWebsiteId(), Setting.getImpressionId(), traceStr)
      .then(res => {
          this.events = [];
          if (!this.trace && res.traces.length > 0) {
            this.traces = res.traces;
            this.trace = res.traces[0];
          }
          if (this.state.onLoading) {
            if (res.traces.length > 0) {
              this.traces = res.traces;
              this.trace = res.traces[0];
            }
            this.setState({
              onLoading: false,
            });
          } else {
            // Only update the `guess` and `reason` of the trace
            this.trace.guess = (res.traces.length === 0 ? -1 : res.traces[0].guess);
            this.trace.reason = (res.traces.length === 0 ? null : res.traces[0].reason);
          }
        }
      ).catch(() => {
      console.log("BACKEND ERROR");
      this.setState({
        status: false
      })
    });
  }

  clearTrace() {
    this.events = [];
    this.traces = [];
    this.trace = this.newTrace();
    this.removeTraceFromLocal();

    this.setState({
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

  getRelativeTimestampInSeconds() {
    let diff = new Date() - this.state.pageLoadTime;
    return Math.trunc(diff) / 1000;
  }

  mouseHandler(type, e) {
    // Listen to mouse events after loading the data
    if (this.state.onLoading) {
      return;
    }

    // PC's Chrome on Mobile mode can still receive "contextmenu" event with zero X, Y, so we ignore these events.
    if (e.type === 'contextmenu' && e.pageX === 0 && e.pageY === 0) {
      return;
    }

    // Don't track our own buttons.
    if (type === 'click' && (e.target.textContent === 'Clear Traces' || e.target.textContent === 'Perform Fake Click')) {
      return;
    }

    // Don't capture the untracked events.
    if (this.targetEvents.indexOf(type) === -1) {
      return;
    }

    let x = parseInt(e.pageX);
    let y = parseInt(e.pageY);
    if (x === undefined) {
      x = parseInt(e.changedTouches[0].pageX);
      y = parseInt(e.changedTouches[0].pageY);
    }

    let p = {
      id: this.events.length,
      timestamp: this.getRelativeTimestampInSeconds(),
      type: type,
      x: x,
      y: y,
      button: this.getButton(e.button)
    };

    // Push the new event info to the buffer
    this.events.push(p);
    if (this.events.length > 50) {
      this.events = this.events.slice(50)
      this.events[0].id = 0;
    }

    this.trace.events.push(p);
    this.traces = [this.trace];
    if (this.trace.events.length % 50 == 0) {
      this.saveTraceToLocal();
    }

    this.setState({
      status: true
    });
  };

  renderResult() {
    if (!this.state.status) {
      return (
        <Alert message="Server Offline" description="Server Offline" type="Informational" showIcon banner/>
      )
    } else {
      if (this.trace === null || this.trace.guess === -1) {
        return (
          <Alert message="No Mouse Trace" description="No Mouse Trace" type="warning" showIcon banner/>
        )
      } else if (this.trace.guess === 1) {
        return (
          <Alert message="You Are Bot" description={this.trace.reason} type="error" showIcon banner/>
        )
      } else if (this.trace.guess === 0) {
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

  onTargetEventsChange(checkedList) {
    this.targetEvents = checkedList;
  }

  renderProgress() {
    if (!this.state.isBackground) {
      return <Progress percent={this.events.length * 2} status="active"/>
    } else {
      return <Progress percent={0} status="exception"/>
    }
  }

  render() {
    if (this.state.onLoading) {
      return (<div>Loading Data...</div>)
    }
    return (
      <div>
        {this.renderProgress()}
        {this.renderResult()}
        <Row>
          <Col span={6}>
            <Row>
              {
                !this.state.isBackground ? <TraceTable title={this.state.sessionId} traces={this.traces} self={null}/> :
                  <TraceTable title={''} traces={[]} self={null}/>
              }
            </Row>
            <Row style={{marginTop: "10px"}}>
              <Col span={12}>
                {/*<div><Text>Events for: </Text><Tag color="#108ee9">{this.state.speed}</Tag></div>*/}
                <Text>Events/s: </Text>
                <Progress type="circle" percent={this.state.speed} format={percent => `${percent}`} width={80}/>
              </Col>
              <Col span={12}>
                <div><Text>Payload size: </Text><Tag color="#108ee9">{this.state.payloadSize}</Tag>Bytes/req</div>
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
              <EventSelectionCheckBox
                allCheckedList={allTargetEvents}
                defaultCheckedList={defaultTargetEvents}
                onCheckedListChange={this.onTargetEventsChange.bind(this)}
              />
            </Row>
          </Col>
          <Col span={12}>
            <Canvas trace={this.trace.events.length > 0 ? this.trace : null} size={Shared.getSizeSmall(this.trace)} isBackground={this.state.isBackground}/>
          </Col>
          <Col span={6}>
            <Row>
              {
                !this.state.isBackground ? Shared.renderEventTable(this.getPathname(), this.events.slice(-10)) : Shared.renderEventTable('', [])
              }
            </Row>
          </Col>
        </Row>
      </div>
    );
  }

}

export default TestPage;
