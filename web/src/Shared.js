import React from "react";
import {Table, Tag, Typography} from "antd";
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

export function renderTraceTable(title, traces, self) {
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

  return (
      <div>
        <Table rowSelection={rowRadioSelection} columns={columns} dataSource={traces} size="small" bordered
               title={() => <div><Text>Traces for: </Text><Tag color="#108ee9">{title}</Tag></div>}/>
      </div>
  );
}

export function renderEventTable(title, events) {
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

  return (
      <div>
        <Table columns={columns} dataSource={events} size="small" bordered
               title={() => <div><Text>Events for: </Text><Tag color="#108ee9">{title}</Tag></div>}/>
      </div>
  );
}
