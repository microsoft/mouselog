import React from "react";
import {Col, Input, Row, Select, Switch} from 'antd';
import Config from "./Config";
import {LinkOutlined} from "@ant-design/icons";
import * as Setting from "./Setting";

const {Option} = Select;

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
    if (["uploadPeriod", "frequency", "resendInterval"].includes(key)) {
      value = Setting.myParseInt(value);
    }
    return value;
  }

  updateConfigField(key, value) {
    value = this.parseConfigField(key, value);

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
          <Col span={1} >
          </Col>
          <Col style={{marginTop: '5px'}} span={2}>
            Upload Endpoint:
          </Col>
          <Col span={16} >
            <Input prefix={<LinkOutlined/>} value={this.props.website.trackConfig.uploadEndpoint} onChange={e => {
              this.updateConfigField("uploadEndpoint", e.target.value);
            }}/>
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}}>
          <Col style={{marginTop: '5px'}} span={2}>
            Upload Mode:
          </Col>
          <Col span={1}>
            <Select style={{width: "150px"}} value={this.props.website.trackConfig.uploadMode} onChange={(value => {
              this.updateConfigField("uploadMode", value);
            })}>
              {
                [
                  {id: "periodic", name: "Periodic"},
                  {id: "event-triggered", name: "Event Triggered"},
                ].map((item, index) => <Option key={index} value={item.id}>{item.name}</Option>)
              }
            </Select>
          </Col>
        </Row>
        {
          this.props.website.trackConfig.uploadMode !== "periodic" ? null :
            <Row style={{marginTop: '20px'}}>
              <Col style={{marginTop: '5px'}} span={2}>
                Upload Period:
              </Col>
              <Col span={1}>
                {
                  <Input style={{width: "100px"}} suffix="ms" value={this.props.website.trackConfig.uploadPeriod} onChange={e => {
                    this.updateConfigField("uploadPeriod", e.target.value);
                  }}/>
                }
              </Col>
            </Row>
        }
        {
          this.props.website.trackConfig.uploadMode !== "event-triggered" ? null :
            <Row style={{marginTop: '20px'}}>
              <Col style={{marginTop: '5px'}} span={2}>
                Frequency:
              </Col>
              <Col span={1}>
                {
                  <Input style={{width: "120px"}} suffix="events/s" value={this.props.website.trackConfig.frequency} onChange={e => {
                    this.updateConfigField("frequency", e.target.value);
                  }}/>
                }
              </Col>
            </Row>
        }
        <Row style={{marginTop: '20px'}}>
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
          <Col span={1} >
          </Col>
          <Col style={{marginTop: '5px'}} span={2}>
            Resend Interval:
          </Col>
          <Col span={1}>
            {
              <Input style={{width: "100px"}} suffix="ms" value={this.props.website.trackConfig.resendInterval} onChange={e => {
                this.updateConfigField("resendInterval", e.target.value);
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
