import React from "react";
import {Button, Col, Popconfirm, Row, Table, Tag, Tooltip} from 'antd';
import {EyeOutlined, MinusOutlined} from '@ant-design/icons';
import * as Setting from "./Setting";
import * as ImpressionBackend from "./backend/ImpressionBackend";
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
    };
  }

  componentDidMount() {
    this.getImpressions();
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

  getFormattedDate(date) {
    date = date.replace('T', ' ');
    date = date.replace('+08:00', ' ');
    return date;
  }

  renderTable(impressions) {
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
        title: 'Url Path',
        dataIndex: 'urlPath',
        key: 'urlPath',
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
      // {
      //   title: 'Page Load Time',
      //   dataIndex: 'pageLoadTime',
      //   key: 'pageLoadTime',
      // },
      {
        title: 'Event Count',
        key: 'eventCount',
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
          if (record.events.length === 0) {
            return null;
          }

          return <Canvas trace={record} size={Shared.getSize(record, 4)} isBackground={false}
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
        <Table columns={columns} dataSource={impressions} rowKey="name" size="middle" bordered pagination={{pageSize: 20}}
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
