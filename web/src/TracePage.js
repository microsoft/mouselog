import React from "react";
import * as Setting from "./Setting";
import * as Shared from "./Shared";
import {Row, Col, BackTop} from 'antd';
import * as Backend from './Backend';
import TraceTable from "./TraceTable";

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
              <TraceTable title={this.state.sessionId} traces={this.state.traces} self={this} isLong={true}
                          hasCanvas={true}/>
            }
          </Col>
        </Row>
      </div>
    );
  }

}

export default TracePage;
