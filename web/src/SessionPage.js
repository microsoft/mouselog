import React from "react";
import {Button, Col, Popconfirm, Row, Table, Tag, Tooltip} from 'antd';
import {EyeOutlined, MinusOutlined} from '@ant-design/icons';
import * as Setting from "./Setting";
import * as SessionBackend from "./backend/SessionBackend";

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
    SessionBackend.deleteSession(this.state.sessions[i].id)
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

  getFormattedDate(date) {
    date = date.replace('T', ' ');
    date = date.replace('+08:00', ' ');
    return date;
  }

  renderTable(sessions) {
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
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
        title: 'User Agent',
        dataIndex: 'userAgent',
        key: 'userAgent',
      },
      {
        title: 'Client IP',
        dataIndex: 'clientIp',
        key: 'clientIp',
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
                <Button style={{marginRight: "5px"}} icon={<EyeOutlined />} size="small" onClick={() => Setting.openLink(`/sessions/${record.id}`)} />
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
        <Table columns={columns} dataSource={sessions} rowKey="name" size="middle" bordered pagination={{pageSize: 100}}
               title={() => (
                 <div>
                   Sessions for: <Tag color="#108ee9">{this.state.websiteId}</Tag>&nbsp;&nbsp;&nbsp;&nbsp;
                   {/*<Button type="primary" size="small" onClick={this.addSession.bind(this)}>Add</Button>*/}
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
              this.renderTable(this.state.sessions)
            }
          </Col>
        </Row>
      </div>
    );
  }
}

export default SessionPage;
