import React from "react";
import * as Setting from "./Setting";
import {Table, Divider, Tag, Row, Col} from 'antd';

class DashboardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      sessions: [],
      fileId : "",
      traces: []
    };
  }

  componentDidMount() {
    fetch(`${Setting.ServerUrl}/api/list-sessions`, {
      method: "GET",
      credentials: "include"
    }).then(res => res.json())
        .then(res => {
          this.setState({
            sessions: res
          });
        });
  }

  renderSessionTable() {
    const columns = [
      {
        title: 'File ID',
        dataIndex: 'sessionId',
        key: 'sessionId',
      },
      {
        title: 'Trace Size',
        dataIndex: 'dataLen',
        key: 'dataLen',
      },
      {
        title: 'Is Bot',
        dataIndex: 'isBot',
        key: 'isBot',
      },
      {
        title: 'Rule',
        dataIndex: 'rule',
        key: 'rule',
      },
      {
        title: 'Rule Start',
        dataIndex: 'ruleStart',
        key: 'ruleStart',
      },
      {
        title: 'Rule End',
        dataIndex: 'ruleEnd',
        key: 'ruleEnd',
      }
    ];

    const rowRadioSelection = {
      type: 'radio',
      columnTitle: 'Select',
      onSelect: (selectedRowKeys, selectedRows) => {
        console.log(selectedRowKeys, selectedRows)

        fetch(`${Setting.ServerUrl}/api/list-traces?fileId=${selectedRowKeys.sessionId}&perPage=${10000000}&page=${0}`, {
          method: "GET",
          credentials: "include"
        }).then(res => res.json())
            .then(res => {
              this.setState({
                traces: res.data,
                fileId: selectedRowKeys.sessionId
              });
            });
      },
    };

    return (
        <div>
          <Table rowSelection={rowRadioSelection} columns={columns} dataSource={this.state.sessions} size="small" bordered title={() => 'Sessions'} />
        </div>
    );
  }

  renderTraceTable() {
    const columns = [
      {
        title: 'URL',
        dataIndex: 'url',
        key: 'url',
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
        title: 'Event Count',
        dataIndex: 'events.length',
        key: 'count',
      }
    ];

    const rowRadioSelection = {
      type: 'radio',
      columnTitle: 'Select',
      onSelect: (selectedRowKeys, selectedRows) => {
        console.log(selectedRowKeys, selectedRows)
      },
    };

    return (
      <div>
        <Table rowSelection={rowRadioSelection} columns={columns} dataSource={this.state.traces} size="small" bordered title={() => 'Traces: ' + this.state.fileId} />
      </div>
    );
  }

  render() {
    return (
        <div>
          <Row>
            <Col span={12}>
              {
                this.renderSessionTable()
              }
              {
                this.renderTraceTable()
              }
            </Col>
            <Col span={12}>col-12</Col>
          </Row>

        </div>
    );
  }

}

export default DashboardPage;
