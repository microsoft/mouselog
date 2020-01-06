import React from "react";
import {Table, Row, Col} from 'antd';
import * as Backend from "./Backend";

class RulePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      rules: [],
    };
  }

  componentDidMount() {
    Backend.listRules()
      .then(res => {
        this.setState({
          rules: res
        });
      });
  }

  renderRuleTable() {
    const columns = [
      {
        title: 'Rule Id',
        dataIndex: 'ruleId',
        key: 'ruleId',
      },
      {
        title: 'Rule Name',
        dataIndex: 'ruleName',
        key: 'ruleName',
      },
    ];

    return (
      <div>
        <Table columns={columns} dataSource={this.state.rules} size="small"
               bordered title={() => 'Rules'}/>
      </div>
    );
  }

  render() {
    return (
      <div>
        <Row>
          <Col span={12}>
            {
              this.renderRuleTable()
            }
          </Col>
        </Row>
      </div>
    );
  }

}

export default RulePage;
