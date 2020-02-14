/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 */

import React from "react";
import {Button, Col, Popconfirm, Row, Table, Tag, Tooltip} from 'antd';
import {EyeOutlined, MinusOutlined} from '@ant-design/icons';
import * as Setting from "./Setting";
import * as WebsiteBackend from "./backend/WebsiteBackend";
import * as PageBackend from "./backend/PageBackend";
import moment from "moment";

class PagePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      websiteId: props.match.params.websiteId,
      pages: [],
      website: null,
    };
  }

  componentDidMount() {
    this.getPages();
    this.getWebsite();
  }

  getPages() {
    PageBackend.getPages(this.state.websiteId)
      .then((res) => {
          this.setState({
            pages: res,
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

  newPage() {
    return {
      id: `/path${this.state.pages.length}`,
      websiteId: this.state.websiteId,
      urlPath: `/path${this.state.pages.length}`,
      createdTime: moment().format(),
      width: 0,
      height: 0,
      screenshotUrl: "https://upload.wikimedia.org/wikipedia/commons/8/87/United_States_Antarctic_Program_website_from_2018_02_22.png",
    }
  }

  addPage() {
    const newPage = this.newPage();
    PageBackend.addPage(newPage)
      .then((res) => {
          Setting.showMessage("success", `Adding page succeeded`);
          this.setState({
            pages: Setting.addRow(this.state.pages, newPage),
          });
        }
      )
      .catch(error => {
        Setting.showMessage("error", `Adding page failed：${error}`);
      });
  }

  deletePage(i) {
    PageBackend.deletePage(this.state.pages[i].id)
      .then((res) => {
          Setting.showMessage("success", `Deleting page succeeded`);
          this.setState({
            pages: Setting.deleteRow(this.state.pages, i),
          });
        }
      )
      .catch(error => {
        Setting.showMessage("error", `Deleting page succeeded：${error}`);
      });
  }

  getFormattedDate(date) {
    date = date.replace('T', ' ');
    date = date.replace('+08:00', ' ');
    return date;
  }

  renderTable(pages) {
    const columns = [
      {
        title: 'Page ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: 'URL Path',
        dataIndex: 'urlPath',
        key: 'urlPath',
        render: (text, record, index) => {
          if (this.state.website === null) {
            return text;
          }

          return <a target="_blank" href={`${this.state.website.url}${text}`}>{text}</a>
        }
      },
      {
        title: 'Created Time',
        dataIndex: 'createdTime',
        key: 'createdTime',
        render: (text, record, index) => {
          return this.getFormattedDate(text);
        }
      },
      {
        title: 'Width',
        dataIndex: 'width',
        key: 'width',
      },
      {
        title: 'Height',
        dataIndex: 'height',
        key: 'height',
      },
      {
        title: 'Screenshot URL',
        dataIndex: 'screenshotUrl',
        key: 'screenshotUrl',
        render: (text, record, index) => {
          return <a target="_blank" href={text}>{text}</a>
        }
      },
      {
        title: 'Image',
        dataIndex: 'image',
        key: 'image',
        render: (text, record, index) => {
          return <img src={record.screenshotUrl} alt="image" width={300} style={{marginBottom: '20px'}}/>
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
                <Button style={{marginRight: "5px"}} icon={<EyeOutlined/>} size="small"
                        onClick={() => Setting.openLink(`/pages/${this.state.websiteId}/pages/${record.id}/impressions`)}/>
              </Tooltip>
              <Popconfirm
                title={`Are you sure to delete page: ${record.id} ?`}
                onConfirm={() => this.deletePage(index)}
                okText="Yes"
                cancelText="No"
              >
                <Tooltip placement="topLeft" title="Delete">
                  <Button icon={<MinusOutlined/>} size="small"/>
                </Tooltip>
              </Popconfirm>
            </div>
          )
        }
      },
    ];

    return (
      <div>
        <Table columns={columns} dataSource={pages} rowKey="name" size="middle" bordered pagination={{pageSize: 100}}
               title={() => (
                 <div>
                   Pages for: <Tag color="#108ee9">{this.state.websiteId}</Tag>&nbsp;&nbsp;&nbsp;&nbsp;
                   <Button type="primary" size="small" onClick={this.addPage.bind(this)}>Add</Button>
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
              this.renderTable(this.state.pages)
            }
          </Col>
        </Row>
      </div>
    );
  }
}

export default PagePage;
