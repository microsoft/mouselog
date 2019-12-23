import React from 'react';
import logo from './logo.svg';
import './App.css';
import * as Setting from "./Setting";

import {Switch, Route} from 'react-router-dom'
import TestPage from "./TestPage";
import DashboardPage from "./DashboardPage";
import {Badge, Button, Layout, Menu, Tag, Typography, Switch as AntdSwitch} from "antd";
import TracePage from "./TracePage";
import * as Backend from "./Backend";
import RulePage from "./RulePage";

const {Title, Paragraph, Text} = Typography;
const {Header, Footer, Sider, Content} = Layout;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      status: true,
      sessionId: "",
      selectedMenuKey: 1,
      enablePlayerFastForward: true,
    };

    Setting.initServerUrl();
  }

  componentWillMount() {
    // eslint-disable-next-line no-restricted-globals
    const uri = location.pathname;
    if (uri.includes('dashboard')) {
      this.setState({ selectedMenuKey: 2 });
    } else if (uri.includes('trace')) {
      this.setState({ selectedMenuKey: 3 });
    } else if (uri.includes('rule')) {
      this.setState({ selectedMenuKey: 4 });
    } else {
      this.setState({ selectedMenuKey: 1 });
    }

    Backend.getSessionId()
    .then(res => res.json())
    .then(res => {
      this.setState({
        sessionId: res,
        status: true
      });
    })
    .catch(error => {
      this.setState({
        status: false
      });
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
      <div id="mouseArea" className="fill-window"
           // React: https://reactjs.org/docs/events.html#mouse-events
           // MDN: https://developer.mozilla.org/en-US/docs/Web/Events
           onMouseMove={(e) => Setting.mouseHandler('mousemove', e)}
           onClick={(e) => Setting.mouseHandler('click', e)}
           onContextMenu={(e) => Setting.mouseHandler('contextmenu', e)}
           onWheel={(e) => Setting.mouseHandler('wheel', e)}
           onTouchStart={(e) => Setting.mouseHandler('touchstart', e)}
           onTouchMove={(e) => Setting.mouseHandler('touchmove', e)}
           onTouchEnd={(e) => Setting.mouseHandler('touchend', e)}
      >
        <Layout className="layout">
          <Header style={{padding: '0', marginBottom: '3px'}}>
            <div className="logo"/>

            <Menu
              // theme="dark"
              mode="horizontal"
              defaultSelectedKeys={[`${this.state.selectedMenuKey}`]}
              style={{lineHeight: '64px'}}
              inlineCollapsed={false}
            >
              <Text>Mouselog</Text>

              <Menu.Item key="1">
                <a href="/">
                  Home
                </a>
              </Menu.Item>
              <Menu.Item key="2">
                <a href="/dashboard">
                  Dashboard
                </a>
              </Menu.Item>
              <Menu.Item key="3">
                <a href="/trace">
                  Trace
                </a>
              </Menu.Item>
              <Menu.Item key="4">
                <a href="/rule">
                  Rule
                </a>
              </Menu.Item>

              <Text style={{float: 'right'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Your Session ID: &nbsp;
                {<Tag color="#108ee9">{this.state.sessionId !== '' ? this.state.sessionId : 'NULL'}</Tag>}
              </Text>
              <Text style={{float: 'right'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Server Status: &nbsp;
                {this.state.status ? <Tag color="#87d068">On</Tag> : <Tag color="#f50">Off</Tag>}
              </Text>
              <Text style={{float: 'right'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Player Fast Forward: &nbsp;
                <AntdSwitch checked={this.state.enablePlayerFastForward} onChange={this.onSwitchChange.bind(this)} />
              </Text>
            </Menu>
          </Header>
        </Layout>

        <Switch>
          <Route exact path="/" component={TestPage}/>
          <Route path="/dashboard/" component={DashboardPage}/>
          <Route path="/trace/:sessionId" component={TracePage}/>
          <Route path="/rule/" component={RulePage}/>
        </Switch>
      </div>
    );
  }

}

export default App;
