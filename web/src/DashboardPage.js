import React from "react";
import * as Setting from "./Setting";
import Table from "react-bootstrap/Table";

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

    return (
        <div>
          <Table striped bordered hover size="sm">
            <thead>
            <tr>
              <th>#</th>
              <th>File ID</th>
              <th>Trace Size</th>
              <th>IsBot</th>
              <th>Rule</th>
              <th>Rule Start</th>
              <th>Rule End</th>
            </tr>
            </thead>
            <tbody>
            {
              this.state.sessions.map(function (e, i) {
                return (
                    <tr>
                      <td>{i}</td>
                      <td>{e.sessionId}</td>
                      <td>{e.dataLen}</td>
                      <td>{e.isBot}</td>
                      <td>{e.rule}</td>
                      <td>{e.ruleStart}</td>
                      <td>{e.ruleEnd}</td>
                    </tr>
                )
              })
            }
            </tbody>
          </Table>
        </div>
    );
  }

}

export default DashboardPage;
