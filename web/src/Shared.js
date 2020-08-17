/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 */

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

export function getDragPointsList(trace, scale) {
  if (trace === null) {
    return [];
  }

  let pointsList = [];
  let points = [];
  let isDragging = false;
  trace.events.forEach(function (event) {
    if (event.type === "mousedown") {
      points = [];
      isDragging = true;

      points.push(event.x * scale);
      points.push(event.y * scale);
    } else if (event.type === "mouseup") {
      points.push(event.x * scale);
      points.push(event.y * scale);

      isDragging = false;
      pointsList.push(points);
      points = [];
    } else {
      if (isDragging) {
        points.push(event.x * scale);
        points.push(event.y * scale);
      }
    }
  });

  return pointsList;
}

export function renderEventTable(title, events, isLong=false, rowClickHandler=null, rowHoverHandler=null, clickRowIndex=-1) {
  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 90,
    },
    {
      title: 'Event Type',
      dataIndex: 'type',
      key: 'type',
      width: 110,
    },
    // {
    //   title: 'Btn',
    //   dataIndex: 'button',
    //   key: 'button',
    // },
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
      title: 'Speed',
      dataIndex: 'speed',
      key: 'speed',
    },
    {
      title: 'Acc',
      dataIndex: 'acceleration',
      key: 'acceleration',
    },
  ];

  let handleRow = record => {
    return {
      onMouseEnter: event => {
        // alert(record);
        rowHoverHandler(record.id);
      },
      onMouseLeave: event => {
        rowHoverHandler(-1);
      },
      onClick: event => {
        rowClickHandler(record.id);
      }
    }
  };
  if (rowHoverHandler === null) {
    handleRow = null;
  }

  let scrollY = 'calc(95vh - 300px)';
  if (isLong) {
    scrollY = document.body.scrollHeight - 280;
  }

  return (
    <div style={{width: "100%"}}>
      <Table columns={columns} dataSource={events} size="small" bordered pagination={{pageSize: 100, hideOnSinglePage: true}}
             title={() => <div><Text>Events for: </Text><Tag color="#108ee9">{title}</Tag></div>} onRow={handleRow}
             rowClassName={(record, index) => { return (record.id === clickRowIndex) ? 'bot-row' : '' }} />
    </div>
  );
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
