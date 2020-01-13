import React from "react";
import {Table, Popover, Button, Tag, Typography} from 'antd';
import Canvas from "./Canvas";
import {getSize, renderEventTable} from "./Shared";
import * as Backend from "./Backend";
import {Link} from "react-router-dom";
import * as Setting from "./Setting";

const {Text} = Typography;

class TraceTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      rules: [],
      hoverRowIndex: -1,
    };
  }

  componentDidMount() {
    Backend.listRules()
      .then(res => {
        this.setState({
          rules: res
        });
      });
  }

  rowHoverHandler(hoverRowIndex) {
    this.setState({
      hoverRowIndex: hoverRowIndex,
    });
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
      {
        title: 'Url',
        dataIndex: 'url',
        key: 'url',
        sorter: (a, b) => a.url.localeCompare(b.url),
        render: (text, trace, index) => {
          return Setting.wrapUrl(text);
        }
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
          title: 'UserAgent',
          dataIndex: 'userAgent',
          key: 'userAgent',
          sorter: (a, b) => a.userAgent.localeCompare(b.userAgent),
          render: (text, trace, index) => {
            return Setting.wrapUserAgent(text);
          }
        },
        {
          title: 'ClientIp',
          dataIndex: 'clientIp',
          key: 'clientIp',
          sorter: (a, b) => a.clientIp.localeCompare(b.clientIp),
          render: (text, trace, index) => {
            return Setting.wrapClientIp(text);
          }
        },
        {
          title: 'PointerType',
          dataIndex: 'pointerType',
          key: 'pointerType',
          sorter: (a, b) => a.pointerType.localeCompare(b.pointerType),
        },
      );
    }

    columns.push(
      {
        title: 'Event Count',
        dataIndex: ['events', 'length'],
        key: 'count',
        sorter: (a, b) => a.events.length - b.events.length,
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
        filters: (
          this.state.rules.map((p, i) => {
            return (
              {
                text: `${p.ruleId}. ${p.ruleName}`,
                value: p.ruleId,
              }
            )
          })
        ),
        // specify the condition of filtering result
        // here is that finding the name started with `value`
        onFilter: (value, record) => {
          return record.ruleId === value;
        },
      }
    );

    if (hasCanvas) {
      const content = (trace) => (
        <div style={{width: '500px'}}>
          {
            renderEventTable(trace.id, trace.events, false, this.rowHoverHandler.bind(this))
          }
        </div>
      );

      const onClick = (link) => {
        // this.props.history.push(link);
        const w = window.open('about:blank');
        w.location.href = link;
      };

      columns.push(
        {
          title: 'Actions',
          key: 'actions',
          render: (text, trace, index) => {
            return (
              <div>
                <Popover placement="topRight" content={content(trace)} title="" trigger="click">
                  <Button>Events</Button>
                </Popover>
                <Button style={{marginTop: '10px'}} type="primary"
                        onClick={() => onClick(`/canvas/${title}/${trace.id}`)}>Details</Button>
              </div>
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
            return <Canvas trace={trace} size={getSize(trace, 4)} isBackground={false}
                           focusIndex={this.state.hoverRowIndex}/>
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
               title={() => <div><Text>Traces for: </Text><Tag color="#108ee9">{title}</Tag></div>}
               pagination={{pageSize: 100}} scroll={{y: scrollY}}
               rowClassName={(record, index) => {
                 return (record.label === 1 || record.guess === 1) ? 'bot-row' : ''
               }}/>
      </div>
    );
  }

}

export default TraceTable;
