import React from "react";
import {Button, Col, Descriptions, Popover, Row, Slider} from "antd";
import * as Backend from "./Backend";
import Canvas from "./Canvas";
import * as Shared from "./Shared";
import {renderEventTable} from "./Shared";

class CanvasPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      sessionId: props.match.params.sessionId,
      traceId: props.match.params.traceId,
      trace: null,
      hoverRowIndex: -1,
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

  rowHoverHandler(hoverRowIndex) {
    this.setState({
      hoverRowIndex: hoverRowIndex,
    });
  }

  render() {
    let size = Shared.getSize(this.state.trace, 1);
    size.height -= 40;

    // <div>
    //   <Popover placement="topRight" content={content(trace)} title="" trigger="click">
    //     <Button>Events</Button>
    //   </Popover>
    //   <Button style={{marginTop: '10px'}} type="primary" onClick={() => onClick(`/canvas/${title}/${trace.id}`)}>Details</Button>
    // </div>

    const content = () => (
      <div style={{ width: '1500px' }}>
        <Descriptions bordered title="Properties" size='small'>
          <Descriptions.Item label="Id">{this.getProperty('id')}</Descriptions.Item>
          <Descriptions.Item label="Url">{this.getProperty('url')}</Descriptions.Item>
          <Descriptions.Item label="UserAgent">{this.getProperty('userAgent')}</Descriptions.Item>
          <Descriptions.Item label="ClientIp">{this.getProperty('clientIp')}</Descriptions.Item>
          <Descriptions.Item label="EventCount">{this.getEventCount()}</Descriptions.Item>
          <Descriptions.Item label="PointerType">{this.getProperty('pointerType')}</Descriptions.Item>
          <Descriptions.Item label="Label">{this.getProperty('label')}</Descriptions.Item>
          <Descriptions.Item label="Guess">{this.getProperty('guess')}</Descriptions.Item>
          <Descriptions.Item label="Reason">{this.getProperty('reason')}</Descriptions.Item>
        </Descriptions>
      </div>
    );

    return (
      <div>
        <Col span={6} style={{paddingLeft: '2.5px'}}>
          <Row>
            <Col span={12}>
              <Popover placement="topRight" content={content()} title="" trigger="click">
                <Button style={{margin: '5px'}} type="primary" block >Request Details</Button>
              </Popover>
            </Col>
            <Col span={12}>
            </Col>
          </Row>
          <Row>
            {
              (this.state.trace !== null) ? Shared.renderEventTable(this.state.trace.id, this.state.trace.events, true, this.rowHoverHandler.bind(this)) : Shared.renderEventTable('', [])
            }
          </Row>
        </Col>
        <Col span={18}>
          <Canvas trace={this.state.trace} size={size} focusIndex={this.state.hoverRowIndex} />
        </Col>
      </div>
    )
  }
}

export default CanvasPage;
