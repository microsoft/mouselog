/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 */

import React from "react";
import {Col, Input, Row, Select, Switch} from 'antd';
import Config from "./Config";
import {LinkOutlined} from "@ant-design/icons";
import * as Setting from "./Setting";

const {Option} = Select;
const {TextArea} = Input;

class ConfigEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
    };
  }

  updateWebsite(website) {
    this.props.onUpdateWebsite(website);
  }

  parseConfigField(key, value) {
    if (["uploadTimes", "uploadPeriod", "frequency", "resendInterval", "sizeLimit"].includes(key)) {
      value = Setting.myParseInt(value);
    }
    return value;
  }

  updateConfigField(key, value) {
    value = this.parseConfigField(key, value);
    if (key === "scope" && !value) {
      value = "window.document";
    }
    let website = this.props.website;
    website.trackConfig[key] = value;
    this.updateWebsite(website);
  }

  render() {
    return (
      <div>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            Endpoint Type:
          </Col>
          <Col span={3}>
            <Select style={{width: "150px"}} value={this.props.website.trackConfig.endpointType} onChange={(value => {
              this.updateConfigField("endpointType", value);
            })}>
              {
                [
                  {id: "absolute", name: "Absolute"},
                  {id: "relative", name: "Relative"},
                ].map((item, index) => <Option key={index} value={item.id}>{item.name}</Option>)
              }
            </Select>
          </Col>
          <Col span={2} >
          </Col>
          <Col style={{marginTop: '5px'}} span={2}>
            Upload Endpoint:
          </Col>
          <Col span={8} >
            <Input prefix={<LinkOutlined/>} value={this.props.website.trackConfig.uploadEndpoint} onChange={e => {
              this.updateConfigField("uploadEndpoint", e.target.value);
            }}/>
          </Col>
          <Col span={2} >
          </Col>
          <Col style={{marginTop: '5px'}} span={2}>
            Resend Interval:
          </Col>
          <Col span={1}>
            {
              <Input style={{width: "120px"}} suffix="ms" value={this.props.website.trackConfig.resendInterval} onChange={e => {
                this.updateConfigField("resendInterval", e.target.value);
              }}/>
            }
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}}>
          <Col style={{marginTop: '5px'}} span={2}>
            Upload Mode:
          </Col>
          <Col span={3}>
            <Select style={{width: "150px"}} value={this.props.website.trackConfig.uploadMode} onChange={(value => {
              this.updateConfigField("uploadMode", value);
            })}>
              {
                [
                  {id: "periodic", name: "Periodic"},
                  {id: "event-triggered", name: "Event Triggered"},
                  {id: "mixed", name: "Mixed"},
                ].map((item, index) => <Option key={index} value={item.id}>{item.name}</Option>)
              }
            </Select>
          </Col>
          <Col span={2} >
          </Col>
          <Col style={{marginTop: '5px'}} span={2}>
            Upload Times:
          </Col>
          <Col span={1}>
            {
              <Input style={{width: "100px"}} suffix="times" value={this.props.website.trackConfig.uploadTimes} onChange={e => {
                this.updateConfigField("uploadTimes", e.target.value);
              }}/>
            }
          </Col>
          <Col span={3} >
          </Col>
          {
            this.props.website.trackConfig.uploadMode === "event-triggered" ? null :
              [
                <Col style={{marginTop: '5px'}} span={2}>
                  Upload Period:
                </Col>,
                <Col span={1}>
                  {
                    <Input style={{width: "100px"}} suffix="ms" value={this.props.website.trackConfig.uploadPeriod} onChange={e => {
                      this.updateConfigField("uploadPeriod", e.target.value);
                    }}/>
                  }
                </Col>
              ]
          }
          {
            this.props.website.trackConfig.uploadMode !== "mixed" ? null :
              <Col span={3} >
              </Col>
          }
          {
            this.props.website.trackConfig.uploadMode === "periodic" ? null :
              [
                <Col style={{marginTop: '5px'}} span={2}>
                  Frequency:
                </Col>,
                <Col span={1}>
                  {
                    <Input style={{width: "120px"}} suffix="events/s" value={this.props.website.trackConfig.frequency} onChange={e => {
                      this.updateConfigField("frequency", e.target.value);
                    }}/>
                  }
                </Col>
              ]
          }
        </Row>
        <Row style={{marginTop: '20px'}}>
          <Col style={{marginTop: '5px'}} span={2}>
            Size Limit:
          </Col>
          <Col span={1}>
            {
              <Input style={{width: "120px"}} suffix="Bytes" value={this.props.website.trackConfig.sizeLimit} onChange={e => {
                this.updateConfigField("sizeLimit", e.target.value);
              }}/>
            }
          </Col>
          <Col span={4} >
          </Col>
          <Col style={{marginTop: '5px'}} span={2}>
            Scope:
          </Col>
          <Col span={3}>
            <TextArea style={{width: "250px"}} value={this.props.website.trackConfig.scope} onChange={(e) =>{
              this.updateConfigField("scope", e.target.value);
            }} autoSize/>
          </Col>
          <Col span={1} >
          </Col>
          <Col style={{marginTop: '5px'}} span={2}>
            Enable GET:
          </Col>
          <Col span={1} >
            {
              <Switch checked={this.props.website.trackConfig.enableGet} onChange={(checked, e) => {
                this.updateConfigField("enableGet", checked);
              }} />
            }
          </Col>
          <Col span={3} >
          </Col>
          <Col style={{marginTop: '5px'}} span={2}>
            Version:
          </Col>
          <Col span={1}>
            {
              <Input style={{width: "120px"}} value={this.props.website.trackConfig.version} onChange={e => {
                this.updateConfigField("version", e.target.value);
              }}/>
            }
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}}>
          <Col style={{marginTop: '5px'}} span={2}>
            Tracking Code:
          </Col>
          <Col span={22}>
            {
              this.props.website.trackConfig === "" ? null :
                <Config website={this.props.website} />
            }
          </Col>
        </Row>
      </div>
    )
  }
}

export default ConfigEdit;
