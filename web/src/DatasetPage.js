/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 */

import React from "react";
import * as Shared from "./Shared";
import {Row, Col} from 'antd';
import Canvas from "./Canvas";
import * as Backend from "./Backend";
import TraceTable from "./TraceTable";
import DatasetTable from "./DatasetTable";

class DatasetPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      datasets: [],
      sessionId: "",
      traces: [],
      trace: null,
      hoverRowIndex: -1,
    };
  }

  componentDidMount() {
    Backend.listDatasets()
      .then(res => {
        this.setState({
          datasets: res
        });
      });
  }

  rowHoverHandler(hoverRowIndex) {
    this.setState({
      hoverRowIndex: hoverRowIndex,
    });
  }

  render() {
    const rowRadioSelection = {
      type: 'radio',
      columnTitle: 'Select',
      onSelect: (selectedRowKeys, selectedRows) => {
        // console.log(selectedRowKeys, selectedRows);

        Backend.listTrace(selectedRowKeys.sessionId)
          .then(res => {
            this.setState({
              traces: res.traces,
              fileId: selectedRowKeys.sessionId
            });
          });
      },
    };

    if (this.state.trace === null) {
      return (
        <div>
          <Row>
            {
              <DatasetTable datasets={this.state.datasets} rowRadioSelection={rowRadioSelection}/>
            }
          </Row>
          <Row>
            <TraceTable title={this.state.fileId} traces={this.state.traces} self={this}/>
          </Row>
        </div>
      )
    }

    return (
      <div>
        <Row>
          <Col span={12}>
            {
              <DatasetTable datasets={this.state.datasets} rowRadioSelection={rowRadioSelection}/>
            }
            <Row>
              <Col span={12} style={{paddingRight: '2.5px'}}>
                {
                  <TraceTable title={this.state.fileId} traces={this.state.traces} self={this}/>
                }
              </Col>
              <Col span={12} style={{paddingLeft: '2.5px'}}>
                {
                  (this.state.trace !== null) ? Shared.renderEventTable(this.state.trace.id, this.state.trace.events, false, this.rowHoverHandler.bind(this)) : Shared.renderEventTable('', [])
                }
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Canvas trace={this.state.trace} size={Shared.getSize(this.state.trace, 2)}
                    focusIndex={this.state.hoverRowIndex}/>
          </Col>
        </Row>
      </div>
    );
  }

}

export default DatasetPage;
