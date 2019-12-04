import React from "react";
import {Table, Tag, Typography} from "antd";
import {Circle, Layer, Line, Stage} from "react-konva";
import {Text as KonvaText} from "react-konva/lib/ReactKonvaCore";
import {Link} from "react-router-dom";
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

export function renderTraceTable(title, traces, self, isLong=false, hasCanvas=false) {
  let columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
      ellipsis: true,
    },
    // {
    //   title: 'Width',
    //   dataIndex: 'width',
    //   key: 'width',
    //   sorter: (a, b) => a.width - b.width,
    // },
    // {
    //   title: 'Height',
    //   dataIndex: 'height',
    //   key: 'height',
    //   sorter: (a, b) => a.height - b.height,
    // },
    {
      title: 'Pointer Type',
      dataIndex: 'pointerType',
      key: 'pointerType',
      sorter: (a, b) => a.events.pointerType - b.events.pointerType,
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

  if (hasCanvas) {
    columns = [
      {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
        sorter: (a, b) => a.id - b.id,
        ellipsis: true,
      },
      {
        title: 'Url',
        dataIndex: 'url',
        key: 'url',
        sorter: (a, b) => a.url - b.url,
      },
      {
        title: 'UserAgent',
        dataIndex: 'userAgent',
        key: 'userAgent',
        sorter: (a, b) => a.userAgent - b.userAgent,
      },
      {
        title: 'ClientIp',
        dataIndex: 'clientIp',
        key: 'clientIp',
        sorter: (a, b) => a.clientIp - b.clientIp,
      },
      {
        title: 'PointerType',
        dataIndex: 'pointerType',
        key: 'pointerType',
        sorter: (a, b) => a.pointerType - b.pointerType,
      },
      {
        title: 'Is Bot',
        dataIndex: 'isBot',
        key: 'isBot',
        sorter: (a, b) => a.isBot - b.isBot,
      }
    ];
  }

  if (hasCanvas) {
    columns.push(
        {
          title: 'Canvas',
          key: 'canvas',
          width: 800,
          render: (text, record, index) => {
            return renderCanvas(traces[record.id], getSize(traces[record.id], 4));
          }
        }
    );
  }

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
                 title={() => <div><Text>Traces for: </Text><Tag color="#108ee9">{title}</Tag></div>} pagination={{pageSize: 100}} scroll={{y: 'calc(95vh - 450px)'}}
                 rowClassName={(record, index) => { return record.isBot === 1 ? 'bot-row' : '' }} />
        </div>
    );
  } else {
    return (
        <div>
          {/*Dynamic height: https://github.com/ant-design/ant-design/issues/14379#issuecomment-458402994 */}
          <Table rowSelection={rowRadioSelection} columns={columns} dataSource={traces} size="small" bordered
                 title={() => <div><Text>Traces for: </Text><Tag color="#108ee9">{title}</Tag></div>} pagination={{pageSize: 100}} scroll={{y: 'calc(95vh - 150px)'}}
                 rowClassName={(record, index) => { return record.isBot ? 'bot-row' : '' }} />
        </div>
    );
  }
}

export function renderEventTable(title, events, isLong=false) {
  const columns = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: type => type.replace('mouse', ''),
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
      title: 'Pointer Type',
      dataIndex: 'pointerType',
      key: 'pointerType',
    }
  ];

  if (!isLong) {
    return (
        <div>
          <Table columns={columns} dataSource={events} size="small" bordered pagination={{pageSize: 100}} scroll={{y: 'calc(95vh - 450px)'}}
                 title={() => <div><Text>Events for: </Text><Tag color="#108ee9">{title}</Tag></div>}/>
        </div>
    );
  } else {
    return (
        <div>
          <Table columns={columns} dataSource={events} size="small" bordered
                 title={() => <div><Text>Events for: </Text><Tag color="#108ee9">{title}</Tag></div>} pagination={{pageSize: 100}} scroll={{y: 700}} />
        </div>
    );
  }
}

function renderEvents(trace, scale) {
  let objs = [];

  trace.events.forEach(function (event) {
    if (event.type === 'mousemove') {
      objs.push(<Circle x={event.x * scale} y={event.y * scale} radius={2} fill="blue"/>);
    } else if (event.type === 'click') {
      objs.push(<Circle x={event.x * scale} y={event.y * scale} radius={8} fill="red" opacity={0.5}/>);
    } else if (event.type === 'contextmenu') {
      objs.push(<Circle x={event.x * scale} y={event.y * scale} radius={8} fill="green" opacity={0.5}/>);
    }
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

export function getSizeSmall() {
  const scale = 0.49;
  const width = document.body.scrollWidth * scale;
  const height = document.body.scrollHeight * scale;

  return {scale: scale, width: width, height: height};
}

export function getSize(trace, divider) {
  let width = Math.trunc(document.body.scrollWidth / divider - 20);
  let height = Math.trunc(document.body.scrollHeight / divider - 20);
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

  return {scale: scale, width: width, height: height};
}

export function renderCanvas(trace, size, isBackground=false) {
  const scale = size.scale;
  const width = size.width;
  const height = size.height;

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
