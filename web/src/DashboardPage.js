import React from "react";
import * as Setting from "./Setting";
import {Table, Divider, Tag, Row, Col, Typography} from 'antd';
import {Circle, Layer, Line, Stage, Text as KonvaText} from "react-konva";

const {Text} = Typography;

class DashboardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      sessions: [],
      fileId: "",
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
        title: 'File ID',
        dataIndex: 'sessionId',
        key: 'sessionId',
      },
      {
        title: 'Trace Size',
        dataIndex: 'traceSize',
        key: 'traceSize',
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

  renderTraceTable(title) {
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
      },
      {
        title: 'Is Bot',
        dataIndex: 'isBot',
        key: 'isBot',
      }
    ];

    const rowRadioSelection = {
      type: 'radio',
      columnTitle: 'Select',
      onSelect: (selectedRowKeys, selectedRows) => {
        console.log(selectedRowKeys, selectedRows);

        this.setState({
          trace: selectedRowKeys,
        });
      },
    };

    return (
        <div>
          <Table rowSelection={rowRadioSelection} columns={columns} dataSource={this.state.traces} size="small" bordered
                 title={() => <div><Text>Traces for: </Text><Tag color="#108ee9">{title}</Tag></div>}/>
        </div>
    );
  }

  renderEventTable(title, events) {
    const columns = [
      {
        title: 'Timestamp (milliseconds)',
        dataIndex: 'timestamp',
        key: 'url',
      },
      {
        title: 'X',
        dataIndex: 'x',
        key: 'x',
      },
      {
        title: 'Y',
        dataIndex: 'y',
        key: 'y',
      }
    ];

    return (
        <div>
          <Table columns={columns} dataSource={events} size="small" bordered
                 title={() => <div><Text>Events for: </Text><Tag color="#108ee9">{title}</Tag></div>}/>
        </div>
    );
  }

  getPoints(scale) {
    if (this.state.trace !== null) {
      return this.getPointsFromTrace(this.state.trace, scale);
    } else {
      return [];
    }
  }

  getPointsFromTrace(trace, scale) {
    let points = [];
    trace.events.forEach(function (event) {
      points.push(event.x * scale);
      points.push(event.y * scale);
    });
    return points;
  }

  renderRuler(width, height, scale) {
    let objs = [];

    for (let x = 0; x < width; x += 200) {
      objs.push(
          <Line
              points={[x * scale, 0, x * scale, 5]}
              stroke="black"
              strokeWidth={0.5}
          />
      );
      objs.push(
          <KonvaText
              x={x * scale - 25}
              y={10}
              text={x.toString()}
          />
      );
    }

    for (let y = 0; y < height; y += 200) {
      objs.push(
          <Line
              points={[0, y * scale, 5, y * scale]}
              stroke="black"
              strokeWidth={0.5}
          />
      );
      objs.push(
          <KonvaText
              x={10}
              y={y * scale - 10}
              text={y.toString()}
          />
      );
    }

    return objs;
  }

  renderCanvas() {
    let canvasWidth = Math.trunc(document.body.scrollWidth / 2 - 20);
    let canvasHeight = Math.trunc(document.body.scrollHeight / 2 - 20);
    let scale = 1;
    if (this.state.trace !== null) {
      let h = Math.trunc(canvasWidth * this.state.trace.height / this.state.trace.width);
      const hMax = document.body.scrollHeight - 100;
      if (h < hMax) {
        canvasHeight = h;
      } else {
        canvasHeight = hMax;
        canvasWidth = Math.trunc(canvasHeight * this.state.trace.width / this.state.trace.height);
      }
      scale = canvasHeight / this.state.trace.height;
    }

    return (
        <Stage width={canvasWidth} height={canvasHeight}
               style={{border: '1px solid rgb(232,232,232)', marginLeft: '5px'}}>
          <Layer>
            <Line
                points={this.getPoints(scale)}
                stroke="black"
                strokeWidth={1}
            />
            {
              (this.state.trace !== null)? this.renderRuler(this.state.trace.width, this.state.trace.height, scale) : null
            }
            {/*{*/}
            {/*  (this.state.ruleStart !== -1 && this.state.ruleEnd !== -1) ? <Line*/}
            {/*      x={0}*/}
            {/*      y={0}*/}
            {/*      points={this.getPoints().slice(this.state.ruleStart * 2, this.state.ruleEnd * 2)}*/}
            {/*      stroke="red"*/}
            {/*      strokeWidth={5}*/}
            {/*      scaleX={0.5}*/}
            {/*      scaleY={0.5}*/}
            {/*    />*/}
            {/*    : null*/}
            {/*}*/}
          </Layer>
        </Stage>
    )
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
                    this.renderTraceTable(this.state.fileId)
                  }
                </Col>
                <Col span={12} style={{paddingLeft: '2.5px'}}>
                  {
                    (this.state.trace !== null) ? this.renderEventTable(this.state.trace.url, this.state.trace.events) : this.renderEventTable('', [])
                  }
                </Col>
              </Row>
            </Col>
            <Col span={12}>
              {this.renderCanvas()}
            </Col>
          </Row>

        </div>
    );
  }

}

export default DashboardPage;
