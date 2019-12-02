import React from "react";
import {Table, Tag, Typography} from "antd";
import {Circle, Layer, Line, Stage} from "react-konva";
import {Text as KonvaText} from "react-konva/lib/ReactKonvaCore";
const {Text} = Typography;

export function getPoints(trace, scale) {
  if (trace === null) {
    return [];
  }

  let points = [];
  trace.events.forEach(function (event) {
    points.push(event.x * scale);
    points.push(event.y * scale);
  });
  return points;
}

export function renderTraceTable(title, traces, self, isLong=false) {
  const columns = [
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      sorter: (a, b) => a.url - b.url,
    },
    {
      title: 'Width',
      dataIndex: 'width',
      key: 'width',
      sorter: (a, b) => a.width - b.width,
    },
    {
      title: 'Height',
      dataIndex: 'height',
      key: 'height',
      sorter: (a, b) => a.height - b.height,
    },
    {
      title: 'Event Count',
      dataIndex: 'events.length',
      key: 'count',
      sorter: (a, b) => a.events.length - b.events.length,
    },
    {
      title: 'Is Bot',
      dataIndex: 'isBot',
      key: 'isBot',
      sorter: (a, b) => a.isBot - b.isBot,
    }
  ];

  let rowRadioSelection = {
    type: 'radio',
    columnTitle: 'Select',
    onSelect: (selectedRowKeys, selectedRows) => {
      console.log(selectedRowKeys, selectedRows);

      self.setState({
        trace: selectedRowKeys,
      });
    },
  };

  if (self === null) {
    rowRadioSelection = null;
  }

  if (!isLong) {
    return (
        <div>
          <Table rowSelection={rowRadioSelection} columns={columns} dataSource={traces} size="small" bordered
                 title={() => <div><Text>Traces for: </Text><Tag color="#108ee9">{title}</Tag></div>}/>
        </div>
    );
  } else {
    return (
        <div>
          <Table rowSelection={rowRadioSelection} columns={columns} dataSource={traces} size="small" bordered
                 title={() => <div><Text>Traces for: </Text><Tag color="#108ee9">{title}</Tag></div>} pagination={{defaultPageSize: 20}}/>
        </div>
    );
  }
}

export function renderEventTable(title, events, isLong=false) {
  const columns = [
    {
      title: 'Timestamp (milliseconds)',
      dataIndex: 'timestamp',
      key: 'url',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
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
    },
    {
      title: 'Is Trusted',
      dataIndex: 'isTrusted',
      key: 'isTrusted',
      render: isTrusted => isTrusted.toString(),
    }
  ];

  if (!isLong) {
    return (
        <div>
          <Table columns={columns} dataSource={events} size="small" bordered
                 title={() => <div><Text>Events for: </Text><Tag color="#108ee9">{title}</Tag></div>}/>
        </div>
    );
  } else {
    return (
        <div>
          <Table columns={columns} dataSource={events} size="small" bordered
                 title={() => <div><Text>Events for: </Text><Tag color="#108ee9">{title}</Tag></div>} pagination={{defaultPageSize: 20}}/>
        </div>
    );
  }
}

function renderEvents(trace, scale) {
  let objs = [];

  trace.events.forEach(function (event) {
    objs.push(<Circle x={event.x * scale} y={event.y * scale} radius={2} fill="blue"/>);
  });

  return objs;
}

function renderRuler(width, height, scale) {
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

export function renderCanvas(trace, scale, width, height, isBackground=false) {
  if (!isBackground) {
    return (
        <Stage width={width} height={height}
               style={{border: '1px solid rgb(232,232,232)', marginLeft: '5px', marginRight: '5px'}}>
          <Layer>
            <Line
                points={getPoints(trace, scale)}
                stroke="black"
                strokeWidth={1}
            />
            {
              (trace !== null) ? renderRuler(trace.width, trace.height, scale) : null
            }
            {
              (trace !== null) ? renderEvents(trace, scale) : null
            }
            {
              (trace !== null && trace.ruleStart !== -1 && trace.ruleEnd !== -1) ? <Line
                      points={getPoints(trace, scale).slice(trace.ruleStart * 2, trace.ruleEnd * 2)}
                      stroke="red"
                      strokeWidth={2}
                  />
                  : null
            }
          </Layer>
        </Stage>
    )
  } else {
    return (
        <Stage width={width} height={height}
               style={{
                 border: '1px solid rgb(232,232,232)',
                 marginLeft: '5px',
                 marginRight: '5px',
                 background: 'rgb(245,245,245)'
               }}>
        </Stage>
    )
  }
}
