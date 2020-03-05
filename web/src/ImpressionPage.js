/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 */

import React from "react";
import {Button, Col, Popconfirm, Row, Table, Tooltip, Select} from 'antd';
import {EyeOutlined, MinusOutlined} from '@ant-design/icons';
import * as Setting from "./Setting";
import * as ImpressionBackend from "./backend/ImpressionBackend";
import * as WebsiteBackend from "./backend/WebsiteBackend";
import * as SessionBackend from "./backend/SessionBackend";
import Canvas from "./Canvas";
import * as Shared from "./Shared";
import BreadcrumbBar from "./BreadcrumbBar";

const { Option } = Select;
const MAX_PAGE_SIZE = 1000;

class ImpressionPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      websiteId: props.match.params.websiteId,
      sessionId: props.match.params.sessionId,
      impressions: [],
      website: null,
      tableLoading: false,
      pagination: {
        current: 1,
        defaultCurrent: 1,
        pageSize: 10
      },
      sorter: {
        field: "",
        order: "ascend"
      }
    };
  }

  componentDidMount() {
    if (this.state.sessionId === undefined) {
      this.getImpressionsAll(
        this.state.pagination.pageSize,
        this.state.pagination.current,
        this.state.sorter.field,
        this.state.sorter.order
      );

      this.getSessionCount();
    } else {
      this.getImpressions(
        this.state.pagination.pageSize,
        this.state.pagination.current,
        this.state.sorter.field,
        this.state.sorter.order
      );

      this.getImpressionCount();
    }

    this.getWebsite();
  }

  getImpressions(pageSize, current, sortField, sortOrder) {
    this.setState({
      tableLoading: true
    });

    ImpressionBackend.getImpressions(
      this.state.websiteId,
      this.state.sessionId,
      pageSize,
      pageSize * (current-1),
      sortField,
      sortOrder === "descend" ? 0 : 1 // "ascend": 1, "descend": 0
    ).then((res) => {
          this.setState({
            impressions: res,
            tableLoading: false
          });
        }
      );
  }

  getImpressionsAll(pageSize, current, sortField, sortOrder) {
    this.setState({
      tableLoading: true
    });

    ImpressionBackend.getImpressionsAll(
      this.state.websiteId,
      pageSize,
      pageSize * (current-1),
      sortField,
      sortOrder === "descend" ? 0 : 1 // "ascend": 1, "descend": 0
    ).then((res) => {
          this.setState({
            impressions: res,
            tableLoading: false
          });
        }
      );
  }

  getImpressionCount() {
    SessionBackend.getSession(
      this.state.sessionId,
      this.state.websiteId
    ).then((res) => {
      const pager = {...this.state.pagination};
      pager.total = res.impressionCount;
      this.setState({
        pagination: pager
      });
    });
  }

  getSessionCount() {
    WebsiteBackend.getWebsite(
      this.state.websiteId
    ).then((res) => {
      const pager = {...this.state.pagination};
      pager.total = res.sessionCount;
      this.setState({
        pagination: pager
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

  onTableChange(pagination, filters, sorter) {
    const pager = {...this.state.pagination};
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;

    const _sorter = {...this.state.sorter};
    _sorter.field = sorter.field ? sorter.field : "";
    _sorter.order = sorter.order ? sorter.order : "";

    this.setState({
      pagination: pager,
      sorter: _sorter
    });

    if (this.state.sessionId === undefined) {
      this.getImpressionsAll(
        pagination.pageSize,
        pagination.current,
        _sorter.field,
        _sorter.order
      );
    } else {
      this.getImpressions(
        pagination.pageSize,
        pagination.current,
        _sorter.field,
        _sorter.order
      );
    }
  }

  onPageSizeChange(value) {
    let pager = {...this.state.pagination};
    pager.pageSize = (value == "All" ? MAX_PAGE_SIZE : parseInt(value));
    this.onTableChange(pager, {}, this.state.sorter);
  }

  renderTable(impressions) {
    let columns = [
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
        width: '300px',
        sorter: (a, b) => a.urlPath.localeCompare(b.urlPath),
        render: (text, record, index) => {
          if (this.state.website === null) {
            return text;
          }

          return (
            <span style={{wordWrap: 'break-word', wordBreak: 'break-word'}}>
              <a target="_blank" href={`${this.state.website.url}${text}`}>
                {text}
              </a>
            </span>
          )
        }
      },
    ];

    if (this.state.sessionId === undefined) {
      columns.push(
        {
          title: 'User Agent',
          dataIndex: 'userAgent',
          key: 'userAgent',
          sorter: (a, b) => a.userAgent.localeCompare(b.userAgent),
          render: (text, record, index) => {
            return Setting.wrapUserAgent(text);
          }
        },
        {
          title: 'Client IP',
          dataIndex: 'clientIp',
          key: 'clientIp',
          width: '130px',
          sorter: (a, b) => a.clientIp.localeCompare(b.clientIp),
          render: (text, record, index) => {
            return Setting.wrapClientIp(text);
          }
        },
      );
    }

    columns.push(
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

          return (
            <div style={{cursor: "pointer"}} onClick={() => Setting.openLink(`/websites/${this.state.websiteId}/sessions/${this.state.sessionId}/impressions/${record.id}/events`)}>
              <Canvas type="embed" trace={record} website={this.state.website} size={Shared.getSize(record, 4)} isBackground={false} focusIndex={-1} />
            </div>
          );
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
    );

    return (
      <div>
        <Table columns={columns}
          dataSource={impressions}
          rowKey="name"
          size="middle"
          bordered
          pagination={this.state.pagination}
          loading={this.state.tableLoading}
          onChange={(pagination, filters, sorter)=>{
            this.onTableChange.call(this, pagination, filters, sorter);
          }}/>
        <Row type="flex" justify="end" style={{marginRight: 20}}>
          <Col>
            <Select defaultValue="10" style={{ width: 80, marginRight: 10}} onChange={(value)=>{this.onPageSizeChange.call(this, value)}}>
              <Option value="10">10</Option>
              <Option value="20">20</Option>
              <Option value="50">50</Option>
              <Option value="100">100</Option>
              <Option value="All">All</Option>
            </Select>
            sessions per page.
          </Col>
        </Row>
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
              this.renderTable(this.state.impressions)
            }
          </Col>
        </Row>
      </div>
    );
  }
}

export default ImpressionPage;
