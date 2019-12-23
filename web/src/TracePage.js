import React from "react";
import * as Setting from "./Setting";
import * as Shared from "./Shared";
import {Row, Col, BackTop} from 'antd';
import * as Backend from './Backend';

class TracePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      sessionId: props.match.params.sessionId,
      traces: [],
      trace: null,
    };
  }

  componentDidMount() {
    Backend.listTrace(this.state.sessionId)
    .then(res => res.json())
    .then(res => {
      this.setState({
        traces: res.traces,
      });
    });
  }

  render() {
    return (
        <div>
          <Row>
            <Col span={24} style={{paddingRight: '2.5px'}}>
              {
                Shared.renderTraceTable(this.state.sessionId, this.state.traces, this, true, true)
              }
            </Col>
          </Row>
        </div>
    );
  }

}

export default TracePage;
