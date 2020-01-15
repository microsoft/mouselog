import React from "react";
import {DownOutlined, EditOutlined, MinusOutlined, UpOutlined} from '@ant-design/icons';
import {Button, Col, Input, Row, Select, Table, Tooltip} from 'antd';
import * as Setting from "./Setting";

const { Option } = Select;

class WebsiteTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
    };
  }

  updateTable(table) {
    this.props.onUpdateTable(table);
  }

  parseField(key, value) {
    if (["start", "end"].includes(key)) {
      value = Setting.myParseInt(value);
    }
    return value;
  }

  updateField(index, key, value) {
    value = this.parseField(key, value);

    let table = this.props.table;
    table[index][key] = value;
    this.updateTable(table);
  }

  newRow() {
    return {id: "new id"};
  }

  addRow() {
    let table = this.props.table;
    let row = this.newRow();
    if (table === undefined) {
      table = [];
    }
    if (table.length > 0) {
      const last = table.slice(-1)[0];
      row = Setting.deepCopy(last);
      row.id = last.id + " (new)";
    }
    table = Setting.addRow(table, row);
    this.updateTable(table);
  }

  deleteRow(i) {
    let table = this.props.table;
    table = Setting.deleteRow(table, i);
    this.updateTable(table);
  }

  upRow(i) {
    let table = this.props.table;
    table = Setting.swapRow(table, i - 1, i);
    this.updateTable(table);
  }

  downRow(i) {
    let table = this.props.table;
    table = Setting.swapRow(table, i, i + 1);
    this.updateTable(table);
  }

  renderTable(table) {
    const columns = [
      {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
        render: (text, record, index) => {
          return (
            <Input value={text} onChange={e => {
              this.updateField(index, 'id', e.target.value);
            }} />
          )
        }
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text, record, index) => {
          return (
            <Input value={text} onChange={e => {
              this.updateField(index, 'name', e.target.value);
            }} />
          )
        }
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record, index) => {
          return (
            <div>
              <Tooltip placement="topLeft" title="Edit">
                <Button style={{marginRight: "5px"}} icon={<EditOutlined />} size="small" onClick={() => Setting.openLink(`/website/${record.id}`)} />
              </Tooltip>
              <Tooltip placement="topLeft" title="Move up">
                <Button style={{marginRight: "5px"}} disabled={index === 0} icon={<UpOutlined />} size="small" onClick={() => this.upRow.bind(this)(index)} />
              </Tooltip>
              <Tooltip placement="topLeft" title="Move down">
                <Button style={{marginRight: "5px"}} disabled={index === table.length - 1} icon={<DownOutlined />} size="small" onClick={() => this.downRow.bind(this)(index)} />
              </Tooltip>
              <Tooltip placement="topLeft" title="Delete">
                <Button icon={<MinusOutlined />} size="small" onClick={() => this.deleteRow.bind(this)(index)} />
              </Tooltip>
            </div>
          );
        }
      },
    ];

    return (
      <div>
        <Table columns={columns} dataSource={table} size="middle" bordered pagination={{pageSize: 100}} scroll={{y: '100vh'}}
               title={() => (
                 <div>
                   {this.props.title}&nbsp;&nbsp;&nbsp;&nbsp;
                   <Button type="primary" size="small" onClick={this.addRow.bind(this)}>Add</Button>
                 </div>
               )}
        />
      </div>
    );
  }

  render() {
    return (
      <div>
        <Row style={{marginTop: '20px'}} >
          {
            this.renderTable(this.props.table)
          }
        </Row>
      </div>
    )
  }
}

export default WebsiteTable;
