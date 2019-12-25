import React from "react";
import {Button, Col, Descriptions, Row, Slider} from "antd";
import * as Backend from "./Backend";
import Canvas from "./Canvas";
import * as Shared from "./Shared";

class CanvasPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      sessionId: props.match.params.sessionId,
      traceId: props.match.params.traceId,
      trace: null,
    };
  }

  componentDidMount() {
    Backend.getTrace(this.state.sessionId, this.state.traceId)
      .then(res => res.json())
      .then(res => {
        this.setState({
          trace: res,
        });
      });
  }

  getProperty(name) {
    if (this.state.trace === null) {
      return 'Loading...'
    } else {
      return this.state.trace[name];
    }
  }

  getEventCount() {
    if (this.state.trace === null) {
      return 'Loading...'
    } else {
      return this.state.trace.events.length;
    }
  }

  render() {
    return (
      <div>
        {/*<Descriptions bordered title="Properties" size='small'>*/}
        {/*  <Descriptions.Item label="Id">{this.getProperty('id')}</Descriptions.Item>*/}
        {/*  <Descriptions.Item label="Url">{this.getProperty('url')}</Descriptions.Item>*/}
        {/*  <Descriptions.Item label="Id">{this.getProperty('userAgent')}</Descriptions.Item>*/}
        {/*  <Descriptions.Item label="Id">{this.getProperty('clientIp')}</Descriptions.Item>*/}
        {/*  <Descriptions.Item label="EventCount">{this.getEventCount()}</Descriptions.Item>*/}
        {/*  <Descriptions.Item label="PointerType">{this.getProperty('pointerType')}</Descriptions.Item>*/}
        {/*  <Descriptions.Item label="Label">{this.getProperty('label')}</Descriptions.Item>*/}
        {/*  <Descriptions.Item label="Guess">{this.getProperty('guess')}</Descriptions.Item>*/}
        {/*  <Descriptions.Item label="Reason">{this.getProperty('reason')}</Descriptions.Item>*/}
        {/*  <Descriptions.Item label="Id">{this.getProperty('id')}</Descriptions.Item>*/}
        {/*</Descriptions>*/}
        <Canvas trace={this.state.trace} size={Shared.getSize(this.state.trace, 2)} />
      </div>
    )
  }
}

export default CanvasPage;
