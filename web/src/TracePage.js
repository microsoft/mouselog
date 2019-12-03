import React from "react";
import * as Setting from "./Setting";
import * as Shared from "./Shared";
import {Row, Col} from 'antd';

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
    fetch(`${Setting.ServerUrl}/api/list-traces?fileId=${this.state.sessionId}&perPage=${10000000}&page=${0}`, {
      method: "GET",
      credentials: "include"
    }).then(res => res.json())
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
