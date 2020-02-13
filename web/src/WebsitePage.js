/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 */

import React from "react";
import {Button, Col, Popconfirm, Popover, Row, Table} from 'antd';
import * as Setting from "./Setting";
import * as WebsiteBackend from "./backend/WebsiteBackend";
import ConfigEdit from "./ConfigEdit";

class WebsitePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      websites: [],
    };
  }

  componentDidMount() {
    this.getWebsites();
  }

  getWebsites() {
    WebsiteBackend.getWebsites()
      .then((res) => {
          this.setState({
            websites: res,
          });
        }
      );
  }

  createConfig() {
    return {
      // Set endpoint URL type: "absolute" or "relative"
      endpointType: "absolute",

      // The endpoint URL to upload trace to
      uploadEndpoint: "https://mouselog.org/",

      // Set upload mode: "periodic" or "event-triggered"
      uploadMode: "periodic",

      // If `uploadMode` == "periodic", data will be uploaded every `uploadPeriod` ms.
      // If no data are collected in a period, no data will be uploaded
      uploadPeriod: 5000,

      // If `uploadMode` == "event-triggered"
      // The website interaction data will be uploaded when every `frequency` events are captured.
      frequency: 50,

      // Use GET method to upload data? (stringified data will be embedded in URI)
      enableGet: false,

      // Time interval for resending the failed trace data
      resendInterval: 3000,
    }
  }

  newWebsite() {
    return {
      id: `website_${this.state.websites.length}`,
      name: `New Website - ${this.state.websites.length}`,
      url: "https://example.com",
      sessionCount: 0,
      trackConfig: this.createConfig(),
      state: "active",
    }
  }

  addWebsite() {
    const newWebsite = this.newWebsite();
    WebsiteBackend.addWebsite(newWebsite)
      .then((res) => {
          Setting.showMessage("success", `Adding website succeeded`);
          this.setState({
            websites: Setting.addRow(this.state.websites, newWebsite),
          });
        }
      )
      .catch(error => {
        Setting.showMessage("error", `Adding website failed：${error}`);
      });
  }

  deleteWebsite(i) {
    WebsiteBackend.deleteWebsite(this.state.websites[i].id)
      .then((res) => {
          Setting.showMessage("success", `Deleting website succeeded`);
          this.setState({
            websites: Setting.deleteRow(this.state.websites, i),
          });
        }
      )
      .catch(error => {
        Setting.showMessage("error", `Deleting website succeeded：${error}`);
      });
  }

  onUpdateWebsite(website, i) {
    let websites = this.state.websites;
    websites[i] = website;
    this.setState({
      websites: websites
    });
  }

  renderTable(websites) {
    const content = (website, i) => {
      return <ConfigEdit website={website} onUpdateWebsite={(website) => this.onUpdateWebsite.bind(this)(website, i)} />
    };

    const columns = [
      {
        title: 'Website ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Url',
        dataIndex: 'url',
        key: 'url',
        render: (text, record, index) => {
          return <a target="_blank" href={text}>{text}</a>
        }
      },
      {
        title: 'Session Count',
        dataIndex: 'sessionCount',
        key: 'sessionCount',
      },
      {
        title: 'Tracking Code',
        key: 'code',
        render: (text, record, index) => {
          return (
            <div>
              <Popover placement="topRight" content={content(record, index)} title="" trigger="click">
                <Button type="primary">View Code</Button>
              </Popover>
            </div>
          )
        }
      },
      {
        title: 'State',
        dataIndex: 'state',
        key: 'state',
        render: (text, record, index) => {
          const item = [
            {id: 'active', name: 'Active'},
            {id: 'inactive', name: 'Stopped'},
          ].filter(item => item.id === text)[0];
          if (item !== undefined) {
            return item.name;
          } else {
            return null;
          }
        }
      },
      {
        title: 'Action',
        dataIndex: '',
        key: 'op',
        width: '130px',
        render: (text, record, index) => {
          return (
            <div>
              <Button style={{marginTop: '10px', marginBottom: '10px'}} onClick={() => Setting.openLink(`/websites/${record.id}`)}>Edit</Button>
              <Button style={{marginBottom: '10px'}} type="primary" onClick={() => Setting.openLink(`/websites/${record.id}/sessions`)}>View Sessions</Button>
              <Popconfirm
                title={`Are you sure to delete website: ${record.name} ?`}
                onConfirm={() => this.deleteWebsite(index)}
                okText="Yes"
                cancelText="No"
              >
                <Button style={{marginBottom: '10px'}} type="danger">Delete</Button>
              </Popconfirm>
            </div>
          )
        }
      },
    ];

    return (
      <div>
        <Table columns={columns} dataSource={websites} rowKey="name" size="middle" bordered pagination={{pageSize: 100}}
               title={() => (
                 <div>
                   My Websites&nbsp;&nbsp;&nbsp;&nbsp;
                   <Button type="primary" size="small" onClick={this.addWebsite.bind(this)}>Add</Button>
                 </div>
               )}
        />
      </div>
    );
  }

  render() {
    return (
      <div>
        <Row>
          <Col span={24}>
            {
              this.renderTable(this.state.websites)
            }
          </Col>
        </Row>
      </div>
    );
  }
}

export default WebsitePage;
