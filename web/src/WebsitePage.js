import React from "react";
import {Button, Col, Popconfirm, Row, Table} from 'antd';
import * as Setting from "./Setting";
import * as WebsiteBackend from "./backend/WebsiteBackend";

class WebsitePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      websites: [],
    };
  }

  componentDidMount() {
    this.getWebsites();
  }

  getWebsites() {
    WebsiteBackend.getWebsites()
      .then((res) => {
          this.setState({
            websites: res,
          });
        }
      );
  }

  newWebsite() {
    return {
      id: `website_${this.state.websites.length}`,
      name: `New Website - ${this.state.websites.length}`,
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
    WebsiteBackend.deleteWebsite(this.state.websites[i])
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

  renderTable(websites) {
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
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
        title: 'Action',
        dataIndex: '',
        key: 'op',
        width: '130px',
        render: (text, record, index) => {
          return (
            <div>
              <Button style={{marginTop: '10px', marginBottom: '10px'}} type="primary" onClick={() => Setting.openLink(`/website-edit/${record.name}`)}>Edit</Button>
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
        <Table columns={columns} dataSource={websites} rowKey="name" size="middle" bordered pagination={{pageSize: 100}}
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
        <Row>
          <Col span={24}>
            {
              this.renderTable(this.state.websites)
            }
          </Col>
        </Row>
      </div>
    );
  }
}

export default WebsitePage;
