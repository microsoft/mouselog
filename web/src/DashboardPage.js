import React from "react";
import * as Setting from "./Setting";
import * as Shared from "./Shared";
import {Table, Divider, Tag, Row, Col, Typography} from 'antd';
import {Circle, Layer, Line, Stage, Text as KonvaText} from "react-konva";

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

  renderEvents(trace, scale) {
    let objs = [];

    trace.events.forEach(function (event) {
      objs.push(<Circle x={event.x * scale} y={event.y * scale} radius={2} fill="blue" />);
    });

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
                points={Shared.getPoints(this.state.trace, scale)}
                stroke="black"
                strokeWidth={1}
            />
            {
              (this.state.trace !== null)? this.renderRuler(this.state.trace.width, this.state.trace.height, scale) : null
            }
            {
              (this.state.trace !== null)? this.renderEvents(this.state.trace, scale) : null
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
              {this.renderCanvas()}
            </Col>
          </Row>

        </div>
    );
  }

}

export default DashboardPage;
