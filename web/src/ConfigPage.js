import React from "react";
import * as Backend from "./Backend";
import {Button, Card, Col, Row} from "antd";
import * as Setting from "./Setting";
import WebsiteTable from "./WebsiteTable";

class ConfigPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      websites: null,
    };
  }

  componentDidMount() {
    this.getWebsites();
  }

  getWebsites() {
    Backend.getWebsites()
      .then((res) => {
          this.setState({
            websites: res,
          });
        }
      );
  }

  onUpdateWebsites(websites) {
    this.setState({
      websites: websites,
    });
  }

  updateMetadata() {
    Backend.updateWebsites(this.state.websites)
      .then((res) => {
        Setting.showMessage("success", `Save succeeded`);
      })
      .catch(error => {
        Setting.showMessage("error", `Sava failed: ${error}`);
      });
  }

  renderContent() {
    return (
      <Card size="small" title={
        <div style={{width: "90vw"}}>
          Edit Metadata&nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="primary" onClick={this.updateMetadata.bind(this)}>Save Change</Button>
        </div>
      } style={{marginLeft: '5px'}} type="inner">
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            Websites:
          </Col>
          <Col span={22} >
            <WebsiteTable title="Websites" table={this.state.websites} onUpdateTable={this.onUpdateWebsites.bind(this)} />
          </Col>
        </Row>
      </Card>
    )
  }

  render() {
    return (
      <div>
        <Row>
          {
            this.state.websites !== null ? this.renderContent() : null
          }
        </Row>
      </div>
    );
  }

}

export default ConfigPage;
