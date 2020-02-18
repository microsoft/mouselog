/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 */

import React from "react";
import {Button, Col, Popconfirm, Row, Table, Tooltip} from 'antd';
import {EyeOutlined, MinusOutlined} from '@ant-design/icons';
import * as Setting from "./Setting";
import * as SessionBackend from "./backend/SessionBackend";
import BreadcrumbBar from "./BreadcrumbBar";

class SessionPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      websiteId: props.match.params.websiteId,
      sessions: [],
    };
  }

  componentDidMount() {
    this.getSessions();
  }

  getSessions() {
    SessionBackend.getSessions(this.state.websiteId)
      .then((res) => {
          this.setState({
            sessions: res,
          });
        }
      );
  }

  deleteSession(i) {
    SessionBackend.deleteSession(this.state.sessions[i].id, this.state.websiteId)
      .then((res) => {
          Setting.showMessage("success", `Deleting session succeeded`);
          this.setState({
            sessions: Setting.deleteRow(this.state.sessions, i),
          });
        }
      )
      .catch(error => {
        Setting.showMessage("error", `Deleting session succeeded：${error}`);
      });
  }

  renderTable(sessions) {
    const columns = [
      {
        title: 'Session ID',
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
        title: 'User Agent',
        dataIndex: 'userAgent',
        key: 'userAgent',
        sorter: (a, b) => a.userAgent.localeCompare(b.userAgent),
      },
      {
        title: 'Client IP',
        dataIndex: 'clientIp',
        key: 'clientIp',
        sorter: (a, b) => a.clientIp.localeCompare(b.clientIp),
      },
      {
        title: 'Impression Count',
        dataIndex: 'impressionCount',
        key: 'impressionCount',
        sorter: (a, b) => a.impressionCount - b.impressionCount,
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
                <Button style={{marginRight: "5px"}} icon={<EyeOutlined />} size="small" onClick={() => Setting.openLink(`/websites/${this.state.websiteId}/sessions/${record.id}/impressions`)} />
              </Tooltip>
              <Popconfirm
                title={`Are you sure to delete session: ${record.id} ?`}
                onConfirm={() => this.deleteSession(index)}
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
        <Table columns={columns} dataSource={sessions} rowKey="name" size="middle" bordered pagination={{pageSize: 100}} />
      </div>
    );
  }

  render() {
    return (
      <div>
        <Row>
          <BreadcrumbBar websiteId={this.state.websiteId} sessionId={this.state.sessionId} />
        </Row>
        <Row>
          <Col span={24}>
            {
              this.renderTable(this.state.sessions)
            }
          </Col>
        </Row>
      </div>
    );
  }
}

export default SessionPage;
