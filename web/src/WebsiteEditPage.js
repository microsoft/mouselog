import React from "react";
import {Button, Card, Col, Input, Row, Select} from 'antd';
import * as WebsiteBackend from "./backend/WebsiteBackend";
import * as Setting from "./Setting";
import ConfigEdit from "./ConfigEdit";
import {LinkOutlined} from "@ant-design/icons";

const { Option } = Select;

class WebsiteEditPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      websiteId: props.match.params.websiteId,
      website: null,
    };
  }

  componentDidMount() {
    this.getWebsite();
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

  parseWebsiteField(key, value) {
    if ([].includes(key)) {
      value = Setting.myParseInt(value);
    }
    return value;
  }

  updateWebsiteField(key, value) {
    value = this.parseWebsiteField(key, value);

    let website = this.state.website;
    website[key] = value;
    this.setState({
      website: website,
    });
  }

  onUpdateWebsite(website) {
    this.setState({
      website: website
    });
  }

  renderConfigAll() {
    return (
      <Row style={{marginTop: '20px'}} >
        <Col style={{marginTop: '5px'}} span={2}>
          Tracking Config:
        </Col>
        <Col span={22} >
          {
            this.state.website.trackConfig !== undefined ? <ConfigEdit website={this.state.website} onUpdateWebsite={this.onUpdateWebsite.bind(this)} /> : null
          }
        </Col>
      </Row>
    )
  }

  renderWebsite() {
    return (
      <Card size="small" title={
        <div>
          Edit Website&nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="primary" onClick={this.submitWebsiteEdit.bind(this)}>Save</Button>
        </div>
      } style={{marginLeft: '5px'}} type="inner">
        <Row style={{marginTop: '10px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            ID:
          </Col>
          <Col span={22} >
            <Input value={this.state.website.id} onChange={e => {
              this.updateWebsiteField('id', e.target.value);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            Name:
          </Col>
          <Col span={22} >
            <Input value={this.state.website.name} onChange={e => {
              this.updateWebsiteField('name', e.target.value);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            Url:
          </Col>
          <Col span={22} >
            <Input prefix={<LinkOutlined/>} value={this.state.website.url} onChange={e => {
              this.updateWebsiteField('url', e.target.value);
            }} />
          </Col>
        </Row>
        {
          this.renderConfigAll()
        }
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            State:
          </Col>
          <Col span={22} >
            <Select style={{width: '120px'}} value={this.state.website.state} onChange={(value => {this.updateWebsiteField('state', value);})}>
              {
                [
                  {id: 'active', name: 'Active'},
                  {id: 'inactive', name: 'Stopped'},
                ].map((item, index) => <Option key={index} value={item.id}>{item.name}</Option>)
              }
            </Select>
          </Col>
        </Row>
      </Card>
    )
  }

  submitWebsiteEdit() {
    let website = Setting.deepCopy(this.state.website);
    WebsiteBackend.updateWebsite(this.state.websiteId, website)
      .then((res) => {
        if (res) {
          Setting.showMessage("success", `Saved successfully`);
          this.setState({
            websiteId: this.state.website.id,
          });
          this.props.history.push(`/websites/${this.state.website.id}`);
        } else {
          Setting.showMessage("error", `Save failed: server-side cannot save`);
          this.updateWebsiteField('id', this.state.websiteId);
        }
      })
      .catch(error => {
        Setting.showMessage("error", `Save failed: ${error}`);
      });
  }

  render() {
    return (
      <div>
        <Row>
          <Col span={24}>
            {
              this.state.website !== null ? this.renderWebsite() : null
            }
          </Col>
        </Row>
        <Row style={{margin: 10}}>
          <Col span={2}>
          </Col>
          <Col span={18}>
            <Button type="primary" size="large" onClick={this.submitWebsiteEdit.bind(this)}>Save</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default WebsiteEditPage;
