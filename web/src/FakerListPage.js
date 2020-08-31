/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 */

import React from "react";
import {Button, Col, Popconfirm, Row, Table} from 'antd';
import moment from "moment";
import * as Setting from "./Setting";
import * as FakerBackend from "./backend/FakerBackend";

class FakerListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      fakers: null,
    };
  }

  componentWillMount() {
    this.getFakers();
  }

  getFakers() {
    FakerBackend.getFakers()
      .then((res) => {
        this.setState({
          fakers: res,
        });
      });
  }

  newFaker() {
    return {
      owner: "admin", // this.props.account.username,
      name: `faker_${this.state.fakers.length}`,
      createdTime: moment().format(),
      title: `New Faker - ${this.state.fakers.length}`,
      script: "script code",
    }
  }

  addFaker() {
    const newFaker = this.newFaker();
    FakerBackend.addFaker(newFaker)
      .then((res) => {
          Setting.showMessage("success", `Faker added successfully`);
          this.setState({
            fakers: Setting.prependRow(this.state.fakers, newFaker),
          });
        }
      )
      .catch(error => {
        Setting.showMessage("error", `Faker failed to add: ${error}`);
      });
  }

  deleteFaker(i) {
    FakerBackend.deleteFaker(this.state.fakers[i])
      .then((res) => {
          Setting.showMessage("success", `Faker deleted successfully`);
          this.setState({
            fakers: Setting.deleteRow(this.state.fakers, i),
          });
        }
      )
      .catch(error => {
        Setting.showMessage("error", `Faker failed to delete: ${error}`);
      });
  }

  renderTable(fakers) {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: '120px',
        sorter: (a, b) => a.name.localeCompare(b.name),
        render: (text, record, index) => {
          return (
            <a href={`/fakers/${text}`}>{text}</a>
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
              <Button style={{marginTop: '10px', marginBottom: '10px', marginRight: '10px'}} type="primary" onClick={() => Setting.goToLink(`/fakers/${record.name}`)}>Edit</Button>
              <Popconfirm
                title={`Sure to delete faker: ${record.name} ?`}
                onConfirm={() => this.deleteFaker(index)}
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
        <Table columns={columns} dataSource={fakers} rowKey="name" size="middle" bordered pagination={{pageSize: 100}}
               title={() => (
                 <div>
                   Fakers&nbsp;&nbsp;&nbsp;&nbsp;
                   <Button type="primary" size="small" onClick={this.addFaker.bind(this)}>Add</Button>
                 </div>
               )}
               loading={fakers === null}
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
              this.renderTable(this.state.fakers)
            }
          </Col>
          <Col span={1}>
          </Col>
        </Row>
      </div>
    );
  }
}

export default FakerListPage;
