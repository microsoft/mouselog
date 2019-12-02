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

  renderCanvas() {
    let width = Math.trunc(document.body.scrollWidth / 2 - 20);
    let height = Math.trunc(document.body.scrollHeight / 2 - 20);
    let scale = 1;
    if (this.state.trace !== null) {
      let h = Math.trunc(width * this.state.trace.height / this.state.trace.width);
      const hMax = document.body.scrollHeight - 100;
      if (h < hMax) {
        height = h;
      } else {
        height = hMax;
        width = Math.trunc(height * this.state.trace.width / this.state.trace.height);
      }
      scale = height / this.state.trace.height;
    }

    return Shared.renderCanvas(this.state.trace, scale, width, height);
  }

  render() {
    return (
        <div>
          <Row>
            <Col span={12}>
              <Row>
                <Col span={12} style={{paddingRight: '2.5px'}}>
                  {
                    Shared.renderTraceTable(this.state.sessionId, this.state.traces, this, true)
                  }
                </Col>
                <Col span={12} style={{paddingLeft: '2.5px'}}>
                  {
                    (this.state.trace !== null) ? Shared.renderEventTable(this.state.trace.url, this.state.trace.events, true) : Shared.renderEventTable('', [], true)
                  }
                </Col>
              </Row>
            </Col>
            <Col span={12}>
              {this.renderCanvas()}
            </Col>
          </Row>

        </div>
    );
  }

}

export default TracePage;
