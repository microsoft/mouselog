/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 */

import React from "react";
import {Row} from 'antd';
import * as Backend from "./Backend";
import DatasetTable from "./DatasetTable";

class DatasetPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      datasets: [],
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

  render() {
    return (
      <div>
        <Row>
          <DatasetTable datasets={this.state.datasets}/>
        </Row>
      </div>
    )
  }
}

export default DatasetPage;
