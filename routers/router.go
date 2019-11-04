package routers

import (
	"github.com/astaxie/beego"

	"github.com/mouselog/mouselog-server/controllers"
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
	beego.Router("/api/get-session-id", &controllers.ApiController{}, "GET:GetSessionId")
}
