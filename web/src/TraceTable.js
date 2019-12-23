import React from "react";
import {Table, Popover, Button, Tag, Typography} from 'antd';
import Canvas from "./Canvas";
import {getSize, renderEventTable} from "./Shared";

const {Text} = Typography;

class TraceTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
    };
  }

  render() {
    const title = this.props.title;
    const traces = this.props.traces;
    const self = this.props.self;
    const isLong = this.props.isLong || false;
    const hasCanvas = this.props.hasCanvas || false;

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
    ];

    if (hasCanvas) {
      columns.push(
        {
          title: 'Url',
          dataIndex: 'url',
          key: 'url',
          sorter: (a, b) => a.url.localeCompare(b.url),
        },
        {
          title: 'UserAgent',
          dataIndex: 'userAgent',
          key: 'userAgent',
          sorter: (a, b) => a.userAgent.localeCompare(b.userAgent),
        },
        {
          title: 'ClientIp',
          dataIndex: 'clientIp',
          key: 'clientIp',
          sorter: (a, b) => a.clientIp.localeCompare(b.clientIp),
        },
      );
    }

    columns.push(
      {
        title: 'Event Count',
        dataIndex: 'events.length',
        key: 'count',
        sorter: (a, b) => a.events.length - b.events.length,
      },
      {
        title: 'PointerType',
        dataIndex: 'pointerType',
        key: 'pointerType',
        sorter: (a, b) => a.pointerType.localeCompare(b.pointerType),
      },
      {
        title: 'Label',
        dataIndex: 'label',
        key: 'label',
        sorter: (a, b) => a.label - b.label,
      },
      {
        title: 'Guess',
        dataIndex: 'guess',
        key: 'guess',
        sorter: (a, b) => a.guess - b.guess,
      },
      {
        title: 'Reason',
        dataIndex: 'reason',
        key: 'reason',
        sorter: (a, b) => a.reason.localeCompare(b.reason),
      }
    );

    if (hasCanvas) {
      const content = (trace) => (
        <div style={{ width: '500px' }}>
          {
            renderEventTable(trace.id, trace.events)
          }
        </div>
      );

      columns.push(
        {
          title: 'Events',
          key: 'events',
          render: (text, trace, index) => {
            return (
              <Popover placement="topRight" content={content(trace)} title="" trigger="click">
                <Button>View</Button>
              </Popover>
            )
          }
        }
      );

      columns.push(
        {
          title: 'Canvas',
          key: 'canvas',
          width: 800,
          render: (trace, index) => {
            return <Canvas trace={trace} size={getSize(trace, 4)} isBackground={false} focusIndex={0} />
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

    if (self === null || hasCanvas) {
      rowRadioSelection = null;
    }

    let scrollY = 'calc(95vh - 450px)';
    if (isLong) {
      scrollY = 'calc(95vh - 150px)';
    }

    // Dynamic height: https://github.com/ant-design/ant-design/issues/14379#issuecomment-458402994
    return (
      <div>
        <Table rowSelection={rowRadioSelection} columns={columns} dataSource={traces} size="small" bordered
               title={() => <div><Text>Traces for: </Text><Tag color="#108ee9">{title}</Tag></div>} pagination={{pageSize: 100}} scroll={{y: scrollY}}
               rowClassName={(record, index) => { return (record.label === 1 || record.guess === 1) ? 'bot-row' : '' }} />
      </div>
    );
  }

}

export default TraceTable;
