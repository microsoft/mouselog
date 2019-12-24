import React from "react"
import * as Setting from "./Setting";
import {Icon, Button, Upload, message} from 'antd'

class UploadFile extends React.Component {
    state = {
      fileList: [],
      uploading: false,
    };
  
    handleUpload = () => {
      const { fileList } = this.state;
      // A form must be created for uploaded the files
      const formData = new FormData(); 
  
      for (let i = 0; i < fileList.length; ++i) {
        formData.append(`file${i}`, fileList[i]);
      }
      
      this.setState({
        uploading: true,
      });
  
      fetch(`${Setting.ServerUrl}/api/upload-file`, {
        method: 'POST',
        credentials: "include",
        body: formData,
      })
      .then(res => res.json())
      .then(
        res => {
          if (res.success === 0)
          {
            message.success('All files are upload successfully');
          } else {
            message.error(`Error:\n${res.message}`)
          }
          this.setState({
            fileList: [],
            uploading: false,
          });
        }
      )
      .catch(
        err => {
          this.setState({uploading: false})
          message.error('upload failed')
        }
      );
    };
  
    render() {
      const { uploading, fileList } = this.state;
      const props = {
        onRemove: file => {
          this.setState(state => {
            const index = state.fileList.indexOf(file);
            const newFileList = state.fileList.slice();
            newFileList.splice(index, 1);
            return {
              fileList: newFileList,
            };
          });
        },
        beforeUpload: file => {
          this.setState(state => ({
            fileList: [...state.fileList, file],
          }));
          return false;
        },
        fileList,
      };
  
      return (
        <div>
          <Upload {...props}>
            <Button>
              <Icon type="upload" /> Select File
            </Button>
          </Upload>
           <Button
            type="primary"
            onClick={this.handleUpload}
            disabled={fileList.length === 0}
            loading={uploading}
            style={{ marginTop: 16 }}
          > 
             {uploading ? 'Uploading' : 'Start Upload'}
          </Button> 
        </div>
      );
    }
  }

  export default UploadFile;