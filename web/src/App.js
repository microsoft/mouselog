/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 */

import React from 'react';
import './App.css';
import * as Setting from "./Setting";

import {Switch, Route} from 'react-router-dom'
import TestPage from "./TestPage";
import DatasetPage from "./DatasetPage";
import {Layout, Menu, Tag, Typography, Switch as AntdSwitch} from "antd";
import TracePage from "./TracePage";
import RulePage from "./RulePage";
import CanvasPage from "./CanvasPage";
import WebsitePage from "./WebsitePage";
import WebsiteEditPage from "./WebsiteEditPage";
import SessionPage from "./SessionPage";
import ImpressionPage from "./ImpressionPage";
import PagePage from "./PagePage";

const {Text} = Typography;
const {Header, Footer} = Layout;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      status: true,
      sessionId: "",
      selectedMenuKey: 1,
      enablePlayerFastForward: true
    };

    Setting.initServerUrl();
  }

  getUrlPath() {
    // eslint-disable-next-line no-restricted-globals
    return location.pathname;
  }

  componentWillMount() {
    const path = this.getUrlPath();
    if (path.includes('datasets')) {
      this.setState({selectedMenuKey: 2});
    } else if (path.includes('trace')) {
      this.setState({selectedMenuKey: 3});
    } else if (path.includes('canvas')) {
      this.setState({selectedMenuKey: 4});
    } else if (path.includes('rule')) {
      this.setState({selectedMenuKey: 5});
    } else if (path.includes('pages')) {
      this.setState({selectedMenuKey: 9});
    } else if (path.includes('impressions')) {
      this.setState({selectedMenuKey: 8});
    } else if (path.includes('sessions')) {
      this.setState({selectedMenuKey: 7});
    } else if (path.includes('websites')) {
      this.setState({selectedMenuKey: 6});
    } else {
      this.setState({selectedMenuKey: 1});
    }

    this.setState({
      sessionId: Setting.getSessionId(),
      status: true
    });
  }

  onSwitchChange(checked, e) {
    this.setState({
      enablePlayerFastForward: checked,
    });
    Setting.setEnablePlayerFastForward(checked);
  }

  render() {
    return (
      <div id="mouseArea" className={this.getUrlPath() === "/" ? "fill-window" : null}
        // React: https://reactjs.org/docs/events.html#mouse-events
        // MDN: https://developer.mozilla.org/en-US/docs/Web/Events
           onMouseMove={(e) => Setting.mouseHandler('mousemove', e)}
           onMouseDown={(e) => Setting.mouseHandler('mousedown', e)}
           onMouseUp={(e) => Setting.mouseHandler('mouseup', e)}
           onClick={(e) => Setting.mouseHandler('click', e)}
           onDoubleClick={(e) => Setting.mouseHandler('dblclick', e)}
           onContextMenu={(e) => Setting.mouseHandler('contextmenu', e)}
           onWheel={(e) => Setting.mouseHandler('wheel', e)}
           onTouchStart={(e) => Setting.mouseHandler('touchstart', e)}
           onTouchMove={(e) => Setting.mouseHandler('touchmove', e)}
           onTouchEnd={(e) => Setting.mouseHandler('touchend', e)}
      >
        <div id="content-wrap">
          <Layout className="layout">
            <Header style={{padding: '0', marginBottom: '3px'}}>
              <a className="logo" href={"/"} />
              <Menu
                // theme="dark"
                mode="horizontal"
                defaultSelectedKeys={[`${this.state.selectedMenuKey}`]}
                style={{lineHeight: '64px'}}
                // inlineCollapsed={false}
              >
                <Menu.Item key="1">
                  <a href="/">
                    Get Started
                  </a>
                </Menu.Item>
                <Menu.Item key="6">
                  <a href="/websites">
                    Websites
                  </a>
                </Menu.Item>
                {
                  !this.getUrlPath().includes('sessions') ? null :
                    <Menu.Item key="7">
                      <a href="#">
                        Sessions
                      </a>
                    </Menu.Item>
                }
                {
                  !this.getUrlPath().includes('impressions') ? null :
                    <Menu.Item key="8">
                      <a href="#">
                        Impressions
                      </a>
                    </Menu.Item>
                }
                {
                  !this.getUrlPath().includes('pages') ? null :
                    <Menu.Item key="9">
                      <a href="#">
                        Pages
                      </a>
                    </Menu.Item>
                }
                <Menu.Item key="2">
                  <a href="/datasets">
                    Dataset
                  </a>
                </Menu.Item>
                {
                  !this.getUrlPath().includes('trace') ? null :
                    <Menu.Item key="3">
                      <a href="#">
                        Trace
                      </a>
                    </Menu.Item>
                }
                {
                  !this.getUrlPath().includes('canvas') ? null :
                    <Menu.Item key="4">
                      <a href="#">
                        Canvas
                      </a>
                    </Menu.Item>
                }
                <Menu.Item key="5">
                  <a href="/rule">
                    Rule
                  </a>
                </Menu.Item>
                <Menu.Item key="100" style={{float: 'right'}}>
                  <a target="_blank" href="https://github.com/microsoft/mouselog">
                    <img alt="GitHub stars" src="https://img.shields.io/github/stars/microsoft/mouselog?style=social" />
                  </a>
                </Menu.Item>
                {
                  this.getUrlPath() !== "/" ? null :
                    <Text style={{float: 'right'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Impression ID: &nbsp;
                      {<Tag color="#108ee9">{Setting.getImpressionId()}</Tag>}
                    </Text>
                }
                {
                  this.getUrlPath() !== "/" ? null :
                    <Text style={{float: 'right'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Session ID: &nbsp;
                      {<Tag color="#108ee9">{this.state.sessionId !== '' ? this.state.sessionId : 'NULL'}</Tag>}
                    </Text>
                }
                <Text style={{float: 'right'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Server Status: &nbsp;
                  {this.state.status ? <Tag color="#87d068">On</Tag> : <Tag color="#f50">Off</Tag>}
                </Text>
                {/*<Text style={{float: 'right'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Player Fast Forward: &nbsp;*/}
                {/*  <AntdSwitch checked={this.state.enablePlayerFastForward} onChange={this.onSwitchChange.bind(this)}/>*/}
                {/*</Text>*/}
              </Menu>
            </Header>
          </Layout>
          <Switch>
            <Route exact path="/" component={TestPage}/>
            <Route path="/datasets/" component={DatasetPage}/>
            <Route path="/trace/:sessionId" component={TracePage}/>
            <Route path="/canvas/:sessionId/:traceId" component={CanvasPage}/>
            <Route path="/rule/" component={RulePage}/>
            <Route exact path="/websites/" component={WebsitePage}/>
            <Route exact path="/websites/:websiteId" component={WebsiteEditPage}/>
            <Route exact path="/websites/:websiteId/sessions" component={SessionPage}/>
            <Route exact path="/websites/:websiteId/sessions/:sessionId/impressions" component={ImpressionPage}/>
            <Route exact path="/websites/:websiteId/impressions" component={ImpressionPage}/>
            <Route exact path="/websites/:websiteId/sessions/:sessionId/impressions/:impressionId/events" component={CanvasPage}/>
            <Route exact path="/websites/:websiteId/pages" component={PagePage}/>
          </Switch>
        </div>
        {/*How to keep your footer where it belongs ?*/}
        {/*https://www.freecodecamp.org/news/how-to-keep-your-footer-where-it-belongs-59c6aa05c59c/*/}
        <Footer id="footer" style={
          {
            borderTop: '1px solid #e8e8e8',
            backgroundColor: 'white',
            textAlign: 'center',
          }
        }>
          Made with <span style={{color: 'rgb(255, 255, 255)'}}>❤️</span> by <a style={{fontWeight: "bold", color: "black"}} target="_blank" href="https://github.com/microsoft/mouselog">Mouselog</a>
        </Footer>
      </div>
    );
  }

}

export default App;
