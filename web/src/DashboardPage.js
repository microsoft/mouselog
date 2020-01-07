import React from "react";
import * as Shared from "./Shared";
import {Table, Row, Col} from 'antd';
import {Link} from "react-router-dom";
import Canvas from "./Canvas";
import * as Backend from "./Backend";
import TraceTable from "./TraceTable";
import UploadFile from "./UploadFile";
import {Circle, Group, Image, Layer, Rect, Stage, Text} from "react-konva";
import * as Setting from "./Setting";

class DashboardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      sessions: [],
      sessionId: "",
      traces: [],
      trace: null,
      hoverRowIndex: -1,
      rules: [],
    };
  }

  componentDidMount() {
    Backend.listSessions()
      .then(res => {
        this.setState({
          sessions: res
        });
      });

    Backend.listRules()
      .then(res => {
        this.setState({
          rules: res
        });
      });
  }

  renderRect(x, y, value, sum) {
    const ratio = value / sum;
    let color;
    let fontColor;
    if (sum === 0) {
      color = "white";
      fontColor = "black";
    } else {
      color = Setting.mixColor([253, 231, 36], [68, 1, 84], ratio);
      fontColor = "white";
    }

    return (
      <Group x={x} y={y}>
        <Rect width={50} height={50} fill={color}/>
        <Text width={50} height={50} strokeWidth={1} fill={fontColor} text={`${value}`} fontSize={20} align={"center"} verticalAlign={"middle"}/>
      </Group>
    )

    return
  }

  renderCM(tn, fp, fn, tp) {
    // return (
    //   <table>
    //     <tr>
    //       <td>TN: <Tag color="rgb(68,1,84)">{`${tn}`}</Tag></td>
    //       <td>FP: <Tag color="rgb(253,231,36)">{`${fp}`}</Tag></td>
    //       <td>FN: <Tag color="rgb(253,231,36)">{`${fn}`}</Tag></td>
    //       <td>TP: <Tag color="rgb(68,1,84)">{`${tp}`}</Tag></td>
    //     </tr>
    //   </table>
    // )

    return (
      <Stage width={101} height={101}
             style={{marginLeft: '5px', marginRight: '5px'}}>
        <Layer>
          {
            this.renderRect(0, 0, tn, tn + fp)
          }
          {
            this.renderRect(50, 0, fp, tn + fp)
          }
          {
            this.renderRect(0, 50, fn, fn + tp)
          }
          {
            this.renderRect(50, 50, tp, fn + tp)
          }
          <Rect width={100} height={100} strokeWidth={1} stroke={"black"}/>
        </Layer>
      </Stage>
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
        render: (text, session, index) => {
          return this.renderCM(session.tn, session.fp, session.fn, session.tp);
        }
      },
      {
        title: 'Precision (%)',
        key: 'precision',
        render: (text, session, index) => {
          return (session.tp * 100.0 / (session.tp + session.fp)).toFixed(2)
        }
      },
      {
        title: 'Recall (%)',
        key: 'recall',
        render: (text, session, index) => {
          return (session.tp * 100.0 / (session.tp + session.fn)).toFixed(2)
        }
      },
      // {
      //   title: 'UN',
      //   dataIndex: 'un',
      //   key: 'un',
      // },
    ];

    this.state.rules.forEach((p, i) => {
      columns.push(
        {
          title: `${p.ruleId}. ${p.ruleName}`,
          key: `${p.ruleId}. ${p.ruleName}`,
          render: (text, session, index) => {
            return session.ruleCounts[i];
          }
        }
      );
    });

    const rowRadioSelection = {
      type: 'radio',
      columnTitle: 'Select',
      onSelect: (selectedRowKeys, selectedRows) => {
        // console.log(selectedRowKeys, selectedRows);

        Backend.listTrace(selectedRowKeys.sessionId)
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
               bordered title={() => 'Sessions'} pagination={{pageSize: 100}} scroll={{y: 'calc(90vh - 150px)'}}/>
        <UploadFile/>
      </div>
    );
  }

  rowHoverHandler(hoverRowIndex) {
    this.setState({
      hoverRowIndex: hoverRowIndex,
    });
  }

  render() {
    if (this.state.trace === null) {
      return (
        <div>
          <Row>
            {
              this.renderSessionTable()
            }
          </Row>
          <Row>
            <TraceTable title={this.state.fileId} traces={this.state.traces} self={this}/>
          </Row>
        </div>
      )
    }

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
                  <TraceTable title={this.state.fileId} traces={this.state.traces} self={this}/>
                }
              </Col>
              <Col span={12} style={{paddingLeft: '2.5px'}}>
                {
                  (this.state.trace !== null) ? Shared.renderEventTable(this.state.trace.id, this.state.trace.events, false, this.rowHoverHandler.bind(this)) : Shared.renderEventTable('', [])
                }
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Canvas trace={this.state.trace} size={Shared.getSize(this.state.trace, 2)}
                    focusIndex={this.state.hoverRowIndex}/>
          </Col>
        </Row>
      </div>
    );
  }

}

export default DashboardPage;
