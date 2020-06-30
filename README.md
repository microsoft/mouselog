Mouselog 🐾
====

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/mouselog.svg?style=flat-square
[npm-url]: http://npmjs.org/package/mouselog
[download-image]: https://img.shields.io/npm/dm/mouselog.svg?style=flat-square
[download-url]: https://npmjs.org/package/mouselog

Mouselog is a web-based platform for website owners to log, visualize and analyze user behaviors like mouse trace data.

## Live Demo

https://mouselog.org/

## Architecture

Mouselog contains 3 parts:

Name | Description | Language | Source code | Release
----|------|----|----|----
Client-side Agent | Mouselog client-side agent that runs on end-user's browser to send mouse trace data to Mouselog server-side | Javascript | N/A (Closed-source) | https://npmjs.com/package/mouselog
Server-frontend | Web frontend UI for Mouselog server-side | Javascript + React + Ant Design | https://github.com/microsoft/mouselog/tree/master/web | N/A
Server-backend | RESTful API backend for Mouselog server-side | Golang + Beego + MySQL | https://github.com/microsoft/mouselog | N/A

## Installation

### Client-side Agent

[![mouselog](https://nodei.co/npm/mouselog.png)](https://npmjs.com/package/mouselog)

The client-side agent is not open-source anymore. The latest release on NPM is `v0.5.0`.

### Server-side

- Get the code:

```
go get github.com/microsoft/mouselog
```

- Prepare a [Xorm ORM](https://gitea.com/xorm/xorm) supported database (MySQL is recommended), replace `root:123@tcp(localhost:3306)/` in [conf/app.conf](https://github.com/microsoft/mouselog/blob/master/conf/app.conf) with your own connection string. Mouselog will create a database named `mouselog` and necessary tables in it if not exist. All Xorm supported databases are listed [here](https://gitea.com/xorm/xorm#user-content-drivers-support).

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
