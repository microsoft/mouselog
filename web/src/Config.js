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

  render() {
    const version = "latest";
    const website = this.props.website;

    const code = `<script>
(function() {
  var script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/mouselog@${version}/mouselog.js";
  script.onload = () => {
    mouselog.run("${website.trackConfig.uploadEndpoint}", "${website.id}");
  };
  var t = document.getElementsByTagName("script");
  var s = t.length > 0 ? t[0].parentNode : document.body;
  s.appendChild(script, s);
})();
</script>`;

    // How do I crop the contents of an Iframe to show a part of a page?
    // https://stackoverflow.com/questions/5676672/how-do-i-crop-the-contents-of-an-iframe-to-show-a-part-of-a-page
    return (
      <div>
        <CodeMirror
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
