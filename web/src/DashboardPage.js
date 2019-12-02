import React from "react";
import * as Setting from "./Setting";
import * as Shared from "./Shared";
import {Table, Row, Col, Typography} from 'antd';
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

  renderCanvas(trace) {
    let width = Math.trunc(document.body.scrollWidth / 2 - 20);
    let height = Math.trunc(document.body.scrollHeight / 2 - 20);
    let scale = 1;
    if (trace !== null) {
      let h = Math.trunc(width * trace.height / trace.width);
      const hMax = document.body.scrollHeight - 100;
      if (h < hMax) {
        height = h;
      } else {
        height = hMax;
        width = Math.trunc(height * trace.width / trace.height);
      }
      scale = height / trace.height;
    }

    return Shared.renderCanvas(trace, scale, width, height);
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
                    (this.state.trace !== null) ? Shared.renderEventTable(this.state.trace.url, this.state.trace.events) : Shared.renderEventTable('', [])
                  }
                </Col>
              </Row>
            </Col>
            <Col span={12}>
              {this.renderCanvas(this.state.trace)}
            </Col>
          </Row>

        </div>
    );
  }

}

export default DashboardPage;
