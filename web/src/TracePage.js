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

  renderCanvas(trace) {
    let width = Math.trunc(document.body.scrollWidth / 2 - 20);
    let height = Math.trunc(document.body.scrollHeight / 2 - 20);
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

    return Shared.renderCanvas(trace, scale, width, height);
  }

  render() {
    return (
        <div>
          <Row>
            <Col span={18} style={{paddingRight: '2.5px'}}>
              {
                Shared.renderTraceTable(this.state.sessionId, this.state.traces, this, true, this.renderCanvas)
              }
            </Col>
            <Col span={6} style={{paddingLeft: '2.5px'}}>
              {
                (this.state.trace !== null) ? Shared.renderEventTable(this.state.trace.url, this.state.trace.events, true) : Shared.renderEventTable('', [], true)
              }
            </Col>
          </Row>
        </div>
    );
  }

}

export default TracePage;
