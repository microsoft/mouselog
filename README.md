Mouselog
====

Mouselog is a web-based tool to help website owners, researchers and security admins log, visualize and analyze the mouse trace data.

## Demo

https://mouselog.org/

## Architecture

Mouselog contains 3 parts:

Name | Description | Language | Source code
----|------|----|----
Agent | Mouselog client-side agent that runs on end-user's browser to send mouse trace data to Mouselog server-side | Javascript | https://github.com/microsoft/mouselog.js
Server-frontend | Web frontend UI for Mouselog server-side | Javascript + React + Ant Design | https://github.com/microsoft/mouselog/tree/master/web
Server-backend | RESTful API backend for Mouselog server-side | Golang + Beego + MySQL | https://github.com/microsoft/mouselog

## Installation

### Agent

Install `mouselog` NPM package in the website that needs monitoring:

```
npm install mouselog
```

### Server-side

- Get the code:

```
go get github.com/microsoft/mouselog
```

- Run Server-backend (in port 9000):

```
go run main.go
 ```

- Run Server-frontend (in the same machine's port 4000):

```
cd web
npm install
npm start
```

- Open browser:

http://localhost:4000/

## License

This project is licensed under the [MIT license](LICENSE).

If you have any issues or feature requests, please contact us. PR is welcomed.
- https://github.com/microsoft/mouselog/issues

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
