import React from "react";
import * as Setting from "./Setting";

class DashboardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      status: false,
    };
  }

  componentDidMount() {
  }

  render() {
    Setting.initServerUrl();

    return (
        <div>
        </div>
    );
  }

}

export default DashboardPage;
