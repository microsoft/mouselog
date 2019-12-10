import React from "react";
import * as Setting from "./Setting";
import * as Shared from "./Shared";
import {Table, Row, Col, Typography, Tag} from 'antd';
import {Link} from "react-router-dom";

const {Text} = Typography;

class DashboardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      sessions: [],
      sessionId: "",
      traces: [],
      trace: null,
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

  getCMTable(tn, fp, fn, tp) {
    // return (
    //     <table>
    //       <tr>
    //         <td>TN: <Tag color="rgb(68,1,84)">{`${tn}`}</Tag></td>
    //         <td>FP: <Tag color="rgb(253,231,36)">{`${fp}`}</Tag></td>
    //       </tr>
    //       <tr>
    //         <td>FN: <Tag color="rgb(253,231,36)">{`${fn}`}</Tag></td>
    //         <td>TP: <Tag color="rgb(68,1,84)">{`${tp}`}</Tag></td>
    //       </tr>
    //     </table>
    // )

    return (
        <table>
          <tr>
            <td>TN: <Tag color="rgb(68,1,84)">{`${tn}`}</Tag></td>
            <td>FP: <Tag color="rgb(253,231,36)">{`${fp}`}</Tag></td>
            <td>FN: <Tag color="rgb(253,231,36)">{`${fn}`}</Tag></td>
            <td>TP: <Tag color="rgb(68,1,84)">{`${tp}`}</Tag></td>
          </tr>
        </table>
    )
  }

  renderSessionTable() {
    const columns = [
      {
        title: 'Session ID (dataset)',
        dataIndex: 'sessionId',
        key: 'sessionId',
        render: (text, record, index) => {
          return <Link to={`/trace/${text}`} target='_blank'>{text}</Link>
        }
      },
      {
        title: 'Trace Count',
        dataIndex: 'traceSize',
        key: 'traceSize',
      },
      {
        title: 'Confusing Matrix',
        key: 'cm',
        render: (text, record, index) => {
          return this.getCMTable(record.tn, record.fp, record.fn, record.tp);
        }
      },
      {
        title: 'UN',
        dataIndex: 'un',
        key: 'un',
      },
    ];

    const rowRadioSelection = {
      type: 'radio',
      columnTitle: 'Select',
      onSelect: (selectedRowKeys, selectedRows) => {
        // console.log(selectedRowKeys, selectedRows);

        fetch(`${Setting.ServerUrl}/api/list-traces?fileId=${selectedRowKeys.sessionId}&perPage=${10000000}&page=${0}`, {
          method: "GET",
          credentials: "include"
        }).then(res => res.json())
            .then(res => {
              this.setState({
                traces: res.traces,
                fileId: selectedRowKeys.sessionId
              });
            });
      },
    };

    return (
        <div>
          <Table rowSelection={rowRadioSelection} columns={columns} dataSource={this.state.sessions} size="small"
                 bordered title={() => 'Sessions'}/>
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
              <Row>
                <Col span={12} style={{paddingRight: '2.5px'}}>
                  {
                    Shared.renderTraceTable(this.state.fileId, this.state.traces, this)
                  }
                </Col>
                <Col span={12} style={{paddingLeft: '2.5px'}}>
                  {
                    (this.state.trace !== null) ? Shared.renderEventTable(this.state.trace.id, this.state.trace.events) : Shared.renderEventTable('', [])
                  }
                </Col>
              </Row>
            </Col>
            <Col span={12}>
              {
                Shared.renderCanvas(this.state.trace, Shared.getSize(this.state.trace, 2))
              }
            </Col>
          </Row>

        </div>
    );
  }

}

export default DashboardPage;
