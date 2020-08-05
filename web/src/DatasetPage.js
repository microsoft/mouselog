/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 */

import React from "react";
import {Row, Table} from 'antd';
import * as Backend from "./Backend";
import * as Setting from "./Setting";
import {Group, Layer, Rect, Stage, Text} from "react-konva";
import {Link} from "react-router-dom";

class DatasetPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      datasets: [],
      rules: [],
    };
  }

  componentWillMount() {
    this.listDatasets();
    this.listRules();
  }

  listDatasets() {
    Backend.listDatasets()
      .then(res => {
        this.setState({
          datasets: res
        });
      });
  }

  listRules() {
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

  renderTable() {
    const columns = [
      {
        title: 'Dataset',
        dataIndex: 'id',
        key: 'id',
        width: '100px',
        render: (text, record, index) => {
          return <Link to={`/websites/${text}/impressions`} target='_blank'>{text}</Link>
        }
      },
      {
        title: 'Impression Count',
        dataIndex: 'impressionCount',
        key: 'impressionCount',
        width: '50px',
      },
      {
        title: 'Confusing Matrix',
        key: 'cm',
        width: '100px',
        render: (text, dataset, index) => {
          return this.renderCM(dataset.tn, dataset.fp, dataset.fn, dataset.tp);
        }
      },
      {
        title: 'Precision (%)',
        key: 'precision',
        width: '50px',
        render: (text, dataset, index) => {
          return (dataset.tp * 100.0 / (dataset.tp + dataset.fp)).toFixed(2)
        }
      },
      {
        title: 'Recall (%)',
        key: 'recall',
        width: '50px',
        render: (text, dataset, index) => {
          return (dataset.tp * 100.0 / (dataset.tp + dataset.fn)).toFixed(2)
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
          width: '70px',
          render: (text, dataset, index) => {
            if (dataset.ruleCounts[i] === 0) {
              return dataset.ruleCounts[i];
            } else {
              return <Link to={`/websites/${dataset.id}/impressions/rules/${p.ruleId}`} target='_blank'>{dataset.ruleCounts[i]}</Link>
            }
          }
        }
      );
    });

    return (
      <div>
        <Table columns={columns} dataSource={this.state.datasets} size="small"
               bordered title={() => 'Datasets'} pagination={{pageSize: 100}} scroll={{y: 'calc(90vh - 200px)'}}/>
      </div>
    );
  }

  render() {
    return (
      <div>
        <Row>
          {
            this.renderTable()
          }
        </Row>
      </div>
    )
  }
}

export default DatasetPage;
