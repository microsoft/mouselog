/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 */

import React from "react";
import {Button, Card, Col, Input, Row} from 'antd';
import * as FakerBackend from "./backend/FakerBackend";
import * as Setting from "./Setting";

import {Controlled as CodeMirror} from 'react-codemirror2'
import "codemirror/lib/codemirror.css"
require("codemirror/mode/lua/lua");

class FakerEditPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      fakerName: props.match.params.fakerName,
      faker: null,
      tasks: [],
      resources: [],
    };
  }

  componentWillMount() {
    this.getFaker();
  }

  getFaker() {
    FakerBackend.getFaker(this.state.fakerName)
      .then((faker) => {
        this.setState({
          faker: faker,
        });
      });
  }

  parseFakerField(key, value) {
    // if ([].includes(key)) {
    //   value = Setting.myParseInt(value);
    // }
    return value;
  }

  updateFakerField(key, value) {
    value = this.parseFakerField(key, value);

    let faker = this.state.faker;
    faker[key] = value;
    this.setState({
      faker: faker,
    });
  }

  renderFaker() {
    return (
      <Card size="small" title={
        <div>
          Edit Faker&nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="primary" onClick={this.submitFakerEdit.bind(this)}>Save</Button>
        </div>
      } style={{marginLeft: '5px'}} type="inner">
        <Row style={{marginTop: '10px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            Name:
          </Col>
          <Col span={22} >
            <Input value={this.state.faker.name} onChange={e => {
              this.updateFakerField('name', e.target.value);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            Title:
          </Col>
          <Col span={22} >
            <Input value={this.state.faker.title} onChange={e => {
              this.updateFakerField('title', e.target.value);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            Script:
          </Col>
          <Col span={22} >
            <CodeMirror
              value={this.state.faker.script}
              options={{mode: 'lua', theme: "default"}}
              onBeforeChange={(editor, data, value) => {
                this.updateFakerField('script', value);
              }}
            />
          </Col>
        </Row>
      </Card>
    )
  }

  submitFakerEdit() {
    let faker = Setting.deepCopy(this.state.faker);
    FakerBackend.updateFaker(this.state.fakerName, faker)
      .then((res) => {
        if (res) {
          Setting.showMessage("success", `Successfully saved`);
          this.setState({
            fakerName: this.state.faker.name,
          });
          this.props.history.push(`/fakers/${this.state.faker.name}`);
        } else {
          Setting.showMessage("error", `failed to save: server side failure`);
          this.updateFakerField('name', this.state.fakerName);
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
              this.state.faker !== null ? this.renderFaker() : null
            }
          </Col>
          <Col span={1}>
          </Col>
        </Row>
        <Row style={{margin: 10}}>
          <Col span={2}>
          </Col>
          <Col span={18}>
            <Button type="primary" size="large" onClick={this.submitFakerEdit.bind(this)}>Save</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default FakerEditPage;
