/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 */

import React from "react";
import {Button, Card, Col, Input, Row} from 'antd';
import * as CaptorBackend from "./backend/CaptorBackend";
import * as Setting from "./Setting";

import {Controlled as CodeMirror} from 'react-codemirror2'
import "codemirror/lib/codemirror.css"
require("codemirror/mode/lua/lua");

class CaptorEditPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      captorName: props.match.params.captorName,
      captor: null,
      tasks: [],
      resources: [],
    };
  }

  componentWillMount() {
    this.getCaptor();
  }

  getCaptor() {
    CaptorBackend.getCaptor(this.state.captorName)
      .then((captor) => {
        this.setState({
          captor: captor,
        });
      });
  }

  parseCaptorField(key, value) {
    // if ([].includes(key)) {
    //   value = Setting.myParseInt(value);
    // }
    return value;
  }

  updateCaptorField(key, value) {
    value = this.parseCaptorField(key, value);

    let captor = this.state.captor;
    captor[key] = value;
    this.setState({
      captor: captor,
    });
  }

  renderCaptor() {
    return (
      <Card size="small" title={
        <div>
          Edit Captor&nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="primary" onClick={this.submitCaptorEdit.bind(this)}>Save</Button>
        </div>
      } style={{marginLeft: '5px'}} type="inner">
        <Row style={{marginTop: '10px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            Name:
          </Col>
          <Col span={22} >
            <Input value={this.state.captor.name} onChange={e => {
              this.updateCaptorField('name', e.target.value);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            Title:
          </Col>
          <Col span={22} >
            <Input value={this.state.captor.title} onChange={e => {
              this.updateCaptorField('title', e.target.value);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            Script:
          </Col>
          <Col span={22} >
            <CodeMirror
              value={this.state.captor.script}
              options={{mode: 'lua', theme: "default"}}
              onBeforeChange={(editor, data, value) => {
                this.updateCaptorField('script', value);
              }}
            />
          </Col>
        </Row>
      </Card>
    )
  }

  submitCaptorEdit() {
    let captor = Setting.deepCopy(this.state.captor);
    CaptorBackend.updateCaptor(this.state.captorName, captor)
      .then((res) => {
        if (res) {
          Setting.showMessage("success", `Successfully saved`);
          this.setState({
            captorName: this.state.captor.name,
          });
          this.props.history.push(`/captors/${this.state.captor.name}`);
        } else {
          Setting.showMessage("error", `failed to save: server side failure`);
          this.updateCaptorField('name', this.state.captorName);
        }
      })
      .catch(error => {
        Setting.showMessage("error", `failed to save: ${error}`);
      });
  }

  render() {
    return (
      <div>
        <Row style={{width: "100%"}}>
          <Col span={1}>
          </Col>
          <Col span={22}>
            {
              this.state.captor !== null ? this.renderCaptor() : null
            }
          </Col>
          <Col span={1}>
          </Col>
        </Row>
        <Row style={{margin: 10}}>
          <Col span={2}>
          </Col>
          <Col span={18}>
            <Button type="primary" size="large" onClick={this.submitCaptorEdit.bind(this)}>Save</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default CaptorEditPage;
