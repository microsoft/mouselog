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
      tableLoading: false
    };
  }

  componentDidMount() {
    this.getWebsites();
  }

  getWebsites() {
    this.setState({
      tableLoading: true
    });
    WebsiteBackend.getWebsites()
      .then((res) => {
          this.setState({
            websites: res,
            tableLoading: false
          });
        }
      ).catch(err => {
        console.log("Unable get websites info");
      });
  }

  createConfig() {
    return {
      // Set endpoint URL type: "absolute" or "relative"
      endpointType: "absolute",

      // The endpoint URL to upload trace to
      uploadEndpoint: "https://mouselog.org/api/upload-trace",

      // Custom Mouselog.js URL, empty means using official mouselog.min.js from NPM CDN
      scriptUrl: "",

      // Time interval for resending the failed trace data
      resendInterval: 20000,

      // Set upload mode: "periodic" or "event-triggered"
      uploadMode: "periodic",

      // Mouselog will stop uploading data after uploading `uploadTimes` batch data.
      uploadTimes: 0,

      // If `uploadMode` == "periodic", data will be uploaded every `uploadPeriod` ms.
      // If no data are collected in a period, no data will be uploaded
      uploadPeriod: 5000,

      // If `uploadMode` == "event-triggered"
      // The website interaction data will be uploaded when every `frequency` events are captured.
      frequency: 50,

      // Maximum size of a single package (byte)
      sizeLimit: 65535,

      // Scope
      scope: "window.document",

      // Use GET method to upload data? (stringified data will be embedded in URI)
      enableGet: false,

      // Script version: "latest" or a specific NPM version like "0.1.8"
      version: "latest",

      // Content: "base64" or an empty string
      // Use a encoder before uploading the data
      encoder: "",

      // Type: Boolean
      // If true, Mouselog will fetch config from backend server during initialization
      enableServerConfig: true,

      // Type: Boolean
      // Mouselog will generate session ID to track user cross-tabs behaviors if true
      enableSession: true,

      // Type: Boolean
      // Allow mouselog to send data without any events
      enableSendEmpty: false,

      // Type: Boolean
      // If not empty, Mouselog will run in debug mode and output debug logs into a HTML div tag specified by this ID
      debugDivId: "",

      // Type: string
      // A global predefined variable for setting the session ID.
      // When initializing the session ID, mouselog will try to call `eval(this.sessionIdVariable)`.
      sessionIdVariable: null,

      // Type: string
      // A global predefined variable for setting the impression ID.
      // When initializing the impression ID, mouselog will try to call `eval(this.impIdVariable)`.
      // Warning: Please don't set the same impression ID variable in two different mouselog instances.
      impIdVariable: null,

      // Type: Boolean
      // If true, Mouselog will load statically from HTML.
      // If false, Mouselog will load dynamically from HTML or Javascript.
      htmlOnly: false,

      // Type: Boolean
      // Not allow internal exceptions to be raised in browser's console
      disableException: false,

      // Type: Boolean
      // If `enablePingMessage`, Mouselog will send a ping message with empty trace immediately after initialization
      enablePingMessage: false,

      // Type: Boolean
      // If `recordKeyboardEvent`, Mouselog will record masked keyboard event
      recordKeyboardEvent: true
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
          if (text === '') {
            return '(empty)';
          }

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
      // {
      //   title: 'Pages',
      //   key: 'pages',
      //   render: (text, record, index) => {
      //     return (
      //       <div>
      //         <Button type="primary" onClick={() => Setting.openLink(`/websites/${record.id}/pages`)}>View Pages</Button>
      //       </div>
      //     )
      //   }
      // },
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
        title: 'View',
        dataIndex: '',
        key: 'op',
        width: '130px',
        render: (text, record, index) => {
          return (
            <div>
              <Button style={{marginTop: '10px', marginBottom: '10px'}} onClick={() => Setting.openLink(`/websites/${record.id}/sessions`)}>Sessions</Button>
              <Button style={{marginBottom: '10px'}} type="primary" onClick={() => Setting.openLink(`/websites/${record.id}/impressions`)}>Impressions</Button>
            </div>
          )
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
        <Table columns={columns} dataSource={websites} rowKey="name" size="middle" bordered pagination={{pageSize: 100}} loading={this.state.tableLoading}
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
        <Row style={{width: "100%"}}>
          <Col span={1}>
          </Col>
          <Col span={22}>
            {
              this.renderTable(this.state.websites)
            }
          </Col>
          <Col span={1}>
          </Col>
        </Row>
      </div>
    );
  }
}

export default WebsitePage;
