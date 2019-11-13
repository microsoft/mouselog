package routers

import (
	"github.com/astaxie/beego"

	"github.com/mouselog/mouselog/controllers"
)

func init() {
	initAPI()
}

func initAPI() {
	ns :=
		beego.NewNamespace("/api",
			beego.NSInclude(
				&controllers.ApiController{},
			),
		)
	beego.AddNamespace(ns)

	beego.Router("/api/upload-trace", &controllers.ApiController{}, "POST:UploadTrace")
	beego.Router("/api/clear-trace", &controllers.ApiController{}, "POST:ClearTrace")
	beego.Router("/api/get-session-id", &controllers.ApiController{}, "GET:GetSessionId")

	beego.Router("/api/list-sessions", &controllers.ApiController{}, "GET:ListSessions")
}
