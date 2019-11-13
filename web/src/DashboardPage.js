import React from "react";
import * as Setting from "./Setting";
import Table from "react-bootstrap/Table";
import BootstrapTable from 'react-bootstrap-table-next';

class DashboardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      sessions: [],
    };
  }

  componentDidMount() {
    fetch(`${Setting.ServerUrl}/api/list-sessions`, {
      method: "GET",
      credentials: "include"
    }).then(res => res.json())
        .then(res => {
          this.setState({
            sessions: res
          });
        });
  }

  render() {
    Setting.initServerUrl();

    const columns = [{
      dataField: 'sessionId',
      text: 'File ID'
    }, {
      dataField: 'dataLen',
      text: 'Trace Size'
    }, {
      dataField: 'isBot',
      text: 'IsBot'
    }, {
      dataField: 'rule',
      text: 'Rule'
    }, {
      dataField: 'ruleStart',
      text: 'Rule Start'
    }, {
      dataField: 'ruleEnd',
      text: 'Rule End'
    }];

    return (
        <div>
          <BootstrapTable keyField='id' data={ this.state.sessions } columns={ columns } striped hover condensed classes={"table-sm"} />
        </div>
    );
  }

}

export default DashboardPage;
