package routers

import (
	"github.com/astaxie/beego"

	"github.com/microsoft/mouselog/controllers"
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
	beego.Router("/api/list-traces", &controllers.ApiController{}, "GET:ListTraces")
	beego.Router("/api/get-trace", &controllers.ApiController{}, "GET:GetTrace")

	beego.Router("/api/list-rules", &controllers.ApiController{}, "GET:ListRules")
	beego.Router("/api/upload-file", &controllers.ApiController{}, "POST:UploadFile")

	beego.Router("/api/get-websites", &controllers.ApiController{}, "GET:GetWebsites")
	beego.Router("/api/update-websites", &controllers.ApiController{}, "POST:UpdateWebsites")
}
