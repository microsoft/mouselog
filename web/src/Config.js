/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 */

import React from "react";
import {Button} from "antd";
import copy from "copy-to-clipboard";
import * as Setting from "./Setting";

import {Controlled as CodeMirror} from 'react-codemirror2'
import "codemirror/lib/codemirror.css"
require('codemirror/theme/material-darker.css');
require("codemirror/mode/javascript/javascript");

class Config extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
    };
  }

  trimStr(s) {
    return ( s || '' ).replace( /^\s+|\s+$/g, '' ); 
  }

  setHeight(codeLinesNumber) {
    if (this.instance === undefined) {
      return;
    }

    // [question] Is there a way to set height of component by a number of lines?
    // https://github.com/scniro/react-codemirror2/issues/124#issuecomment-460038374
    const height = `${codeLinesNumber * 25}px`;
    this.instance.setSize('100%', height);
  }

  getConfigText(website) {
    let res = "let config = {";

    res += `\n      uploadEndpoint: "${website.trackConfig.uploadEndpoint}",`;

    res += `\n      websiteId: "${website.id}",`;

    if (website.trackConfig.endpointType !== "absolute") {
      res += `\n      endpointType: "${website.trackConfig.endpointType}",`;
    }

    if (website.trackConfig.uploadMode === "periodic") {
      res += `\n      uploadMode: "${website.trackConfig.uploadMode}",`;
      res += `\n      uploadPeriod: ${website.trackConfig.uploadPeriod},`;
    }

    if (website.trackConfig.uploadMode === "event-triggered") {
      res += `\n      uploadMode: "${website.trackConfig.uploadMode}",`;
      res += `\n      frequency: ${website.trackConfig.frequency},`;
    }

    if (website.trackConfig.uploadMode === "mixed") {
        res += `\n      uploadPeriod: ${website.trackConfig.uploadPeriod},`;
        res += `\n      frequency: ${website.trackConfig.frequency},`;
    }

    if (website.trackConfig.enableGet !== false) {
      res += `\n      enableGet: ${website.trackConfig.enableGet},`;
    }
    
    let trimmedScope = this.trimStr(website.trackConfig.scope)
    if (trimmedScope !== "window.document") {
      let lines = trimmedScope.split('\n');
      res += `\n      scope: ${lines[0]}`;
      for (let i = 1; i < lines.length; ++i) {
        res += `\n      ${lines[i]}`;
      }
      res += `,`;
    }
    
    if (res === "let config = {") {
      return "";
    }

    res = res.slice(0, res.length-1); //Remove the tailing comma

    res += `\n    };\n    `;

    return res;
  }

  getCode() {
    const version = "latest";
    const website = this.props.website;

    const configText = this.getConfigText(website);
    const code = `<script>
(function() {
  var script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/mouselog@${version}/build/mouselog.min.js";
  script.onload = () => {
    ${configText}var agent = mouselog.Mouselog();
    agent.run(config);
  };
  var t = document.getElementsByTagName("script");
  var s = t.length > 0 ? t[0].parentNode : document.body;
  s.appendChild(script, s);
})();
</script>`;

    const lineCount = code.split(`\n`).length - 1;
    this.setHeight(lineCount);

    return code;
  }

  render() {
    const code = this.getCode();

    // How do I crop the contents of an Iframe to show a part of a page?
    // https://stackoverflow.com/questions/5676672/how-do-i-crop-the-contents-of-an-iframe-to-show-a-part-of-a-page
    return (
      <div style={{width: "700px"}}>
        <CodeMirror
          editorDidMount={editor => {
            this.instance = editor;
            this.getCode();
          }}
          value={code}
          options={{mode: 'javascript', theme: "material-darker"}}
        />
        <Button style={{marginTop: '10px'}} type="primary" onClick={() => {
          copy(code);
          Setting.showMessage("success", `Copied to clipboard!`);
        }}
        >
          Copy to Clipboard
        </Button>
      </div>
    )
  }
}

export default Config;
