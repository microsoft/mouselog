/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 */

import React from "react";
import {Breadcrumb} from "antd";
import {HomeOutlined, LayoutOutlined, UserOutlined, FileImageOutlined} from "@ant-design/icons";
import * as Setting from "./Setting";

class BreadcrumbBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
    };
  }

  render() {
    const websiteId = this.props.websiteId;
    const sessionId = this.props.sessionId;
    const impressionId = this.props.impressionId;

    let items = [];

    items.push(
      <Breadcrumb.Item href="/websites">
        <HomeOutlined />
        <span>All Websites</span>
      </Breadcrumb.Item>
    );

    if (websiteId !== undefined) {
      items.push(
        <Breadcrumb.Item href={`/websites/${websiteId}/sessions`}>
          <LayoutOutlined />
          <span>Website: {Setting.getTagLink(websiteId)}</span>
        </Breadcrumb.Item>
      );
    }

    if (sessionId !== undefined) {
      items.push(
        <Breadcrumb.Item href={`/websites/${websiteId}/sessions/${sessionId}/impressions`}>
          <UserOutlined />
          <span>Session: {Setting.getTagLink(sessionId)}</span>
        </Breadcrumb.Item>
      );
    }

    if (impressionId !== undefined) {
      items.push(
        <Breadcrumb.Item href={`/websites/${websiteId}/sessions/${sessionId}/impressions/${impressionId}/events`}>
          <FileImageOutlined />
          <span>Impression: {Setting.getTagLink(impressionId)}</span>
        </Breadcrumb.Item>
      );
    }

    return (
      <div>
        <Breadcrumb separator=">" style={{paddingLeft: '5px'}}>
          {
            items
          }
        </Breadcrumb>
      </div>
    )
  }
}

export default BreadcrumbBar;
