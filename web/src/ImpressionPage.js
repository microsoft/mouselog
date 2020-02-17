/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 */

import React from "react";
import {Button, Col, Popconfirm, Row, Table, Tag, Tooltip} from 'antd';
import {EyeOutlined, MinusOutlined} from '@ant-design/icons';
import * as Setting from "./Setting";
import * as ImpressionBackend from "./backend/ImpressionBackend";
import * as WebsiteBackend from "./backend/WebsiteBackend";
import Canvas from "./Canvas";
import * as Shared from "./Shared";

class ImpressionPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      websiteId: props.match.params.websiteId,
      sessionId: props.match.params.sessionId,
      impressions: [],
      website: null,
    };
  }

  componentDidMount() {
    this.getImpressions();
    this.getWebsite();
  }

  getImpressions() {
    ImpressionBackend.getImpressions(this.state.sessionId)
      .then((res) => {
          this.setState({
            impressions: res,
          });
        }
      );
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

  deleteImpression(i) {
    ImpressionBackend.deleteImpression(this.state.impressions[i].id)
      .then((res) => {
          Setting.showMessage("success", `Deleting impression succeeded`);
          this.setState({
            impressions: Setting.deleteRow(this.state.impressions, i),
          });
        }
      )
      .catch(error => {
        Setting.showMessage("error", `Deleting impression succeeded：${error}`);
      });
  }

  renderTable(impressions) {
    const columns = [
      {
        title: 'Impression ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: 'Created Time',
        dataIndex: 'createdTime',
        key: 'createdTime',
        sorter: (a, b) => a.createdTime.localeCompare(b.createdTime),
        render: (text, record, index) => {
          return Setting.getFormattedDate(text);
        }
      },
      {
        title: 'URL Path',
        dataIndex: 'urlPath',
        key: 'urlPath',
        sorter: (a, b) => a.urlPath.localeCompare(b.urlPath),
        render: (text, record, index) => {
          if (this.state.website === null) {
            return text;
          }

          return <a target="_blank" href={`${this.state.website.url}${text}`}>{text}</a>
        }
      },
      {
        title: 'Width',
        dataIndex: 'width',
        key: 'width',
        sorter: (a, b) => a.width - b.width,
      },
      {
        title: 'Height',
        dataIndex: 'height',
        key: 'height',
        sorter: (a, b) => a.height - b.height,
      },
      // {
      //   title: 'Page Load Time',
      //   dataIndex: 'pageLoadTime',
      //   key: 'pageLoadTime',
      // },
      {
        title: 'Event Count',
        key: 'eventCount',
        sorter: (a, b) => a.events.length - b.events.length,
        render: (text, record, index) => {
          if (record.events === null) {
            return null;
          }

          return record.events.length;
        }
      },
      {
        title: 'Canvas',
        key: 'canvas',
        width: 500,
        render: (text, record, index) => {
          if (record.events.length === 0 || this.state.website === null) {
            return null;
          }

          return <Canvas trace={record} website={this.state.website} size={Shared.getSize(record, 4)} isBackground={false}
                         focusIndex={-1}/>
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
              <Tooltip placement="topLeft" title="View">
                <Button style={{marginRight: "5px"}} icon={<EyeOutlined />} size="small" onClick={() => Setting.openLink(`/websites/${this.state.websiteId}/sessions/${this.state.sessionId}/impressions/${record.id}/events`)} />
              </Tooltip>
              <Popconfirm
                title={`Are you sure to delete impression: ${record.id} ?`}
                onConfirm={() => this.deleteImpression(index)}
                okText="Yes"
                cancelText="No"
              >
                <Tooltip placement="topLeft" title="Delete">
                  <Button icon={<MinusOutlined />} size="small" />
                </Tooltip>
              </Popconfirm>
            </div>
          )
        }
      },
    ];

    return (
      <div>
        <Table columns={columns} dataSource={impressions} rowKey="name" size="middle" bordered pagination={{pageSize: 100}}
               title={() => (
                 <div>
                   Impressions for: <Tag color="#108ee9">{this.state.websiteId}</Tag> -> <Tag color="#108ee9">{this.state.sessionId}</Tag>&nbsp;&nbsp;&nbsp;&nbsp;
                   {/*<Button type="primary" size="small" onClick={this.addImpression.bind(this)}>Add</Button>*/}
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
              this.renderTable(this.state.impressions)
            }
          </Col>
        </Row>
      </div>
    );
  }
}

export default ImpressionPage;
