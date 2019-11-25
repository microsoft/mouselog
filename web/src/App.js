import React from 'react';
import logo from './logo.svg';
import './App.css';
import * as Setting from "./Setting";

import {Switch, Route} from 'react-router-dom'
import TestPage from "./TestPage";
import DashboardPage from "./DashboardPage";
import {Badge, Button, Layout, Menu, Tag, Typography} from "antd";

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
    };
  }

  componentWillMount() {
    // eslint-disable-next-line no-restricted-globals
    const uri = location.pathname;
    if (uri.includes('dashboard')) {
      this.setState({ selectedMenuKey: 2 });
    } else {
      this.setState({ selectedMenuKey: 1 });
    }
  }

  componentDidMount() {
    fetch(`${Setting.ServerUrl}/api/get-session-id`, {
      method: "GET",
      credentials: "include"
    }).then(res => res.json())
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

  render() {
    Setting.initServerUrl();

    return (
      <div id="mouseArea" className="fill-window"
           // React: https://reactjs.org/docs/events.html
           // MDN: https://developer.mozilla.org/en-US/docs/Web/Events
           onMouseMove={(e) => Setting.mouseHandler('mousemove', e)}
           onClick={(e) => Setting.mouseHandler('click', e)}
           onContextMenu={(e) => Setting.mouseHandler('contextmenu', e)}
           onScroll={(e) => Setting.mouseHandler('scroll', e)}
           onWheel={(e) => Setting.mouseHandler('wheel', e)}
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
              <Text>Mouse Tracking</Text>

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

              <Text>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Server Status: </Text>
              {this.state.status ? <Tag color="#87d068">On</Tag> : <Tag color="#f50">Off</Tag>}
              <Text>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Your Session ID: </Text>
              {<Tag color="#108ee9">{this.state.sessionId !== '' ? this.state.sessionId : 'NULL'}</Tag>}
            </Menu>
          </Header>
        </Layout>

        <Switch>
          <Route exact path="/" component={TestPage}/>
          <Route path="/dashboard/" component={DashboardPage}/>
        </Switch>
      </div>
    );
  }

}

export default App;
