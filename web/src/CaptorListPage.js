/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 */

import React from "react";
import {Button, Col, Popconfirm, Row, Table} from 'antd';
import moment from "moment";
import * as Setting from "./Setting";
import * as CaptorBackend from "./backend/CaptorBackend";

class CaptorListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      captors: null,
    };
  }

  componentWillMount() {
    this.getCaptors();
  }

  getCaptors() {
    CaptorBackend.getCaptors()
      .then((res) => {
        this.setState({
          captors: res,
        });
      });
  }

  newCaptor() {
    return {
      owner: "admin", // this.props.account.username,
      name: `captor_${this.state.captors.length}`,
      createdTime: moment().format(),
      title: `New Captor - ${this.state.captors.length}`,
      script: "script code",
    }
  }

  addCaptor() {
    const newCaptor = this.newCaptor();
    CaptorBackend.addCaptor(newCaptor)
      .then((res) => {
          Setting.showMessage("success", `Captor added successfully`);
          this.setState({
            captors: Setting.prependRow(this.state.captors, newCaptor),
          });
        }
      )
      .catch(error => {
        Setting.showMessage("error", `Captor failed to add: ${error}`);
      });
  }

  deleteCaptor(i) {
    CaptorBackend.deleteCaptor(this.state.captors[i])
      .then((res) => {
          Setting.showMessage("success", `Captor deleted successfully`);
          this.setState({
            captors: Setting.deleteRow(this.state.captors, i),
          });
        }
      )
      .catch(error => {
        Setting.showMessage("error", `Captor failed to delete: ${error}`);
      });
  }

  renderTable(captors) {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: '120px',
        sorter: (a, b) => a.name.localeCompare(b.name),
        render: (text, record, index) => {
          return (
            <a href={`/captors/${text}`}>{text}</a>
          )
        }
      },
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        // width: '80px',
        sorter: (a, b) => a.title.localeCompare(b.title),
      },
      {
        title: 'Created Time',
        dataIndex: 'createdTime',
        key: 'createdTime',
        width: '160px',
        sorter: (a, b) => a.createdTime.localeCompare(b.createdTime),
        render: (text, record, index) => {
          return Setting.getFormattedDate(text);
        }
      },
      {
        title: 'Script',
        dataIndex: 'script',
        key: 'script',
        width: '120px',
        ellipsis: true,
        sorter: (a, b) => a.script.localeCompare(b.script),
      },
      {
        title: 'Action',
        dataIndex: '',
        key: 'op',
        width: '160px',
        render: (text, record, index) => {
          return (
            <div>
              <Button style={{marginTop: '10px', marginBottom: '10px', marginRight: '10px'}} type="primary" onClick={() => Setting.goToLink(`/captors/${record.name}`)}>Edit</Button>
              <Popconfirm
                title={`Sure to delete captor: ${record.name} ?`}
                onConfirm={() => this.deleteCaptor(index)}
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
        <Table columns={columns} dataSource={captors} rowKey="name" size="middle" bordered pagination={{pageSize: 100}}
               title={() => (
                 <div>
                   Captors&nbsp;&nbsp;&nbsp;&nbsp;
                   <Button type="primary" size="small" onClick={this.addCaptor.bind(this)}>Add</Button>
                 </div>
               )}
               loading={captors === null}
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
              this.renderTable(this.state.captors)
            }
          </Col>
          <Col span={1}>
          </Col>
        </Row>
      </div>
    );
  }
}

export default CaptorListPage;
