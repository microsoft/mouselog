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
    let res = "var config = {";

    res += `\n      uploadEndpoint: "${website.trackConfig.uploadEndpoint}",`;

    if (website.trackConfig.resendInterval !== 20000) {
      res += `\n      resendInterval: ${website.trackConfig.resendInterval},`;
    }
    if (website.trackConfig.uploadMode !== "mixed") {
      res += `\n      uploadMode: "${website.trackConfig.uploadMode}",`;
    }

    if (website.trackConfig.uploadTimes !== 1) {
      res += `\n      uploadTimes: ${website.trackConfig.uploadTimes},`;
    }

    if (website.trackConfig.uploadMode === "periodic") {
      res += `\n      uploadPeriod: ${website.trackConfig.uploadPeriod},`;
    } else if (website.trackConfig.uploadMode === "event-triggered") {
      res += `\n      frequency: ${website.trackConfig.frequency},`;
    } else if (website.trackConfig.uploadMode === "mixed") {
      if (website.trackConfig.uploadPeriod !== 30000) {
        res += `\n      uploadPeriod: ${website.trackConfig.uploadPeriod},`;
      }
      if (website.trackConfig.frequency !== 50) {
        res += `\n      frequency: ${website.trackConfig.frequency},`;
      }
    }

    if (website.trackConfig.sizeLimit !== 7000) {
      res += `\n      sizeLimit: ${website.trackConfig.sizeLimit},`;
    }

    if (website.trackConfig.encoder !== "base64") {
      res += `\n      encoder: "${website.trackConfig.encoder}",`;
    }

    if (website.trackConfig.enableSendEmpty !== true) {
      res += `\n      enableSendEmpty: ${website.trackConfig.enableSendEmpty},`;
    }

    if (website.trackConfig.impIdVariable !== "") {
      res += `\n      impIdVariable: "${website.trackConfig.impIdVariable}",`;
    }

    if (website.trackConfig.disableException !== true) {
      res += `\n      disableException: ${website.trackConfig.disableException},`;
    }


    if (website.trackConfig.recordKeyboardEvent !== true) {
      res += `\n      recordKeyboardEvent: false,`;
    }

    let trimmedScope = this.trimStr(website.trackConfig.scope);
    if (trimmedScope !== "window.document") {
      let lines = trimmedScope.split('\n');
      res += `\n      scope: ${lines[0]}`;
      for (let i = 1; i < lines.length; ++i) {
        res += `\n      ${lines[i]}`;
      }
      res += `,`;
    }

    if (res === "var config = {") {
      return "";
    }

    res = res.slice(0, res.length-1); //Remove the tailing comma

    res += `\n    };\n    `;
    if (website.trackConfig.enablePingMessage !== false) {
      res += 'var impressionId = "";\n    ';
      res += 'try {\n        ';
      res += 'impressionId = eval(config.impIdVariable);\n        ';
      res += 'if (impressionId === undefined || impressionId === null) {\n        ';
      res += 'impressionId = "Err_" + config.impIdVariable + "_is_" + impressionId;\n        ';
      res += '}\n    ';
      res += '} catch(e) {\n        ';
      res += 'impressionId = "Err_fail_to_get_" + config.impIdVariable;\n    ';
      res += '}\n    '
      res += '(new Image).src= config.uploadEndpoint + "?impressionId=" + impressionId + "&type=ping";\n    ';
    }

    return res;
  }

  getCode(website) {
    const version = "latest";

    let scriptUrl;
    if (website.trackConfig.scriptUrl === undefined || website.trackConfig.scriptUrl === "") {
      scriptUrl = `https://cdn.jsdelivr.net/npm/mouselog@${website.trackConfig.version}/build/mouselog.min.js`;
    } else {
      scriptUrl = website.trackConfig.scriptUrl;
    }

    let runLine;
    if (website.trackConfig.debugDivId === undefined || website.trackConfig.debugDivId === "") {
      runLine = `agent.run(config);`
    } else {
      runLine = `agent.debug(config, "${website.trackConfig.debugDivId}");`;
    }

    const configText = this.getConfigText(website);

    let code;
    if (!website.trackConfig.htmlOnly) {
      code = `<script>
(function() {
  var script = document.createElement("script");
  script.src = "${scriptUrl}";
  script.onload = function() {
    ${configText}var agent = mouselog.init();
    ${runLine}
  };
  document.addEventListener('DOMContentLoaded', function () {
    document.body.appendChild(script);
  });
})();
</script>`;
    } else {
      code = `<script src="${scriptUrl}"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    ${configText}var agent = mouselog.init();
    ${runLine}
  });
</script>`;
    }

    const lineCount = code.split(`\n`).length - 1;
    this.setHeight(lineCount);

    return code;
  }

  render() {
    const website = this.props.website;
    const code = this.getCode(website);

    // How do I crop the contents of an Iframe to show a part of a page?
    // https://stackoverflow.com/questions/5676672/how-do-i-crop-the-contents-of-an-iframe-to-show-a-part-of-a-page
    return (
      <div style={{width: "700px"}}>
        <CodeMirror
          editorDidMount={editor => {
            this.instance = editor;
            this.getCode(website);
          }}
          value={code}
          options={{mode: 'javascript', theme: "material-darker"}}
        />
        <Button style={{marginTop: '10px'}} type="primary" onClick={() => {
          copy(code);
          Setting.showMessage("success", `Copied to clipboard!`);
        }}
        >
          Copy HTML Code
        </Button>
        {
          website.trackConfig.htmlOnly ? null :
            <Button style={{marginTop: '10px', marginLeft: '10px'}} type="primary" onClick={() => {
              let jsCode = code.slice(9, -10);
              copy(jsCode);
              Setting.showMessage("success", `Copied to clipboard!`);
            }}
            >
              Copy Javascript Code
            </Button>
        }
      </div>
    )
  }
}

export default Config;
