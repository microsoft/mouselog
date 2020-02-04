import React from "react";
import {Button, Col, Popconfirm, Row, Table, Tag} from 'antd';
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
              <Button style={{marginTop: '10px', marginBottom: '10px'}} type="primary" onClick={() => Setting.openLink(`/sessions/${record.id}`)}>View</Button>
              <Popconfirm
                title={`Are you sure to delete session: ${record.id} ?`}
                onConfirm={() => this.deleteSession(index)}
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
