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

    if (website.trackConfig.uploadMode !== "periodic") {
      res += `\n      uploadMode: "${website.trackConfig.uploadMode}",`;

      if (website.trackConfig.frequency !== 50) {
        res += `\n      frequency: ${website.trackConfig.frequency},`;
      }
    } else {
      if (website.trackConfig.uploadPeriod !== 5000) {
        res += `\n      uploadPeriod: ${website.trackConfig.uploadPeriod},`;
      }
    }

    if (website.trackConfig.encoder !== "JSON.stringify") {
      res += `\n      encoder: "${website.trackConfig.encoder}",`;
    }

    if (website.trackConfig.decoder !== "x => x") {
      res += `\n      decoder: "${website.trackConfig.decoder}",`;
    }

    if (website.trackConfig.enableGet !== false) {
      res += `\n      enableGet: ${website.trackConfig.enableGet},`;
    }

    if (website.trackConfig.resendInterval !== 3000) {
      res += `\n      resendInterval: ${website.trackConfig.resendInterval},`;
    }

    if (res === "let config = {") {
      return "";
    }

    res += `\n    };\n\n    `;

    return res;
  }

  getCode() {
    const version = "latest";
    const website = this.props.website;

    const code = `<script>
(function() {
  var script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/mouselog@${version}/mouselog.js";
  script.onload = () => {
    ${this.getConfigText(website)}mouselog.run("${website.trackConfig.uploadEndpoint}", "${website.id}");
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
      <div style={{width: "650px"}}>
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
