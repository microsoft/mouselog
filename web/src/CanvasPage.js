/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 */

import React from "react";
import {Button, Col, Descriptions, Popover, Row} from "antd";
import * as ImpressionBackend from "./backend/ImpressionBackend";
import * as WebsiteBackend from "./backend/WebsiteBackend";
import Canvas from "./Canvas";
import * as Shared from "./Shared";
import * as Setting from "./Setting";
import BreadcrumbBar from "./BreadcrumbBar";

class CanvasPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      websiteId: props.match.params.websiteId,
      sessionId: props.match.params.sessionId,
      impressionId: props.match.params.impressionId,
      trace: null,
      website: null,
      hoverRowIndex: -1,
      clickRowIndex: -1,
    };

    this.canvas = React.createRef();
  }

  componentDidMount() {
    this.getImpression();
    this.getWebsite();
  }

  getImpression() {
    ImpressionBackend.getImpression(this.state.impressionId, this.state.websiteId)
      .then(res => {
        this.setState({
          trace: res,
        });
      });
  }

  getWebsite() {
    WebsiteBackend.getWebsite(this.state.websiteId)
      .then((website) => {
          this.setState({
            website: website,
          });
        }
      );
  }

  getProperty(name) {
    return this.state.trace[name];
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

  rowClickHandler(clickRowIndex) {
    this.setState({
      clickRowIndex: clickRowIndex,
    });

    this.canvas.current.updateFromTableToCanvas(clickRowIndex);
  }

  canvasClickHandler(clickRowIndex) {
    this.setState({
      clickRowIndex: clickRowIndex,
    });
  }

  renderEventTable() {
    if (this.state.trace !== null) {
      return Shared.renderEventTable(this.state.trace.id, this.state.trace.events, true, this.rowClickHandler.bind(this), this.rowHoverHandler.bind(this), this.state.clickRowIndex)
    } else {
      return Shared.renderEventTable('', []);
    }
  }

  render() {
    let size = Shared.getSize(this.state.trace, 4 / 3);
    size.height -= 40;

    // <div>
    //   <Popover placement="topRight" content={content(trace)} title="" trigger="click">
    //     <Button>Events</Button>
    //   </Popover>
    //   <Button style={{marginTop: '10px'}} type="primary" onClick={() => onClick(`/canvas/${title}/${trace.id}`)}>Details</Button>
    // </div>

    const content = () => {
      if (this.state.trace === null) {
        return 'Loading...';
      }

      return (
        <div style={{width: '1500px'}}>
          <Descriptions bordered title="Properties" size='small'>
            <Descriptions.Item label="Id">{this.getProperty('id')}</Descriptions.Item>
            <Descriptions.Item label="Url">{Setting.wrapUrl(this.getProperty('url'))}</Descriptions.Item>
            <Descriptions.Item
              label="UserAgent">{Setting.wrapUserAgent(this.getProperty('userAgent'))}</Descriptions.Item>
            <Descriptions.Item label="ClientIp">{Setting.wrapClientIp(this.getProperty('clientIp'))}</Descriptions.Item>
            <Descriptions.Item label="EventCount">{this.getEventCount()}</Descriptions.Item>
            <Descriptions.Item label="PointerType">{this.getProperty('pointerType')}</Descriptions.Item>
            <Descriptions.Item label="Label">{this.getProperty('label')}</Descriptions.Item>
            <Descriptions.Item label="Guess">{this.getProperty('guess')}</Descriptions.Item>
            <Descriptions.Item label="Reason">{this.getProperty('reason')}</Descriptions.Item>
          </Descriptions>
        </div>
      )
    };

    return (
      <div>
        <Row>
          <BreadcrumbBar websiteId={this.state.websiteId} sessionId={this.state.sessionId} impressionId={this.state.impressionId} />
        </Row>
        <Row>
          <Col span={6} style={{paddingLeft: '2.5px'}}>
            <Row>
              <Col span={6}>
                <Popover placement="topRight" content={content()} title="" trigger="click">
                  <Button style={{margin: '5px'}} type="primary">Request Details</Button>
                </Popover>
              </Col>
              <Col span={6}>
              </Col>
              <Col span={12}>
                <div>
                  {
                    `hoverRowIndex: ${this.state.hoverRowIndex}`
                  }
                </div>
                <div>
                  {
                    `clickRowIndex: ${this.state.clickRowIndex}`
                  }
                </div>
              </Col>
            </Row>
            <Row>
            </Row>
            <Row>
              {
                this.renderEventTable()
              }
            </Row>
          </Col>
          <Col span={18}>
            {
              this.state.website === null ? null :
                <Canvas type="standalone" ref={this.canvas} trace={this.state.trace} website={this.state.website} size={size}
                        clickHandler={this.canvasClickHandler.bind(this)} hoverIndex={this.state.hoverRowIndex}/>
            }
          </Col>
        </Row>
      </div>
    )
  }
}

export default CanvasPage;
