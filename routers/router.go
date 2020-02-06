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
	beego.Router("/api/upload-trace", &controllers.ApiController{}, "GET:UploadTrace")
	
	beego.Router("/api/clear-trace", &controllers.ApiController{}, "POST:ClearTrace")
	beego.Router("/api/get-session-id", &controllers.ApiController{}, "GET:GetSessionId")

	beego.Router("/api/list-sessions", &controllers.ApiController{}, "GET:ListSessions")
	beego.Router("/api/list-traces", &controllers.ApiController{}, "GET:ListTraces")
	beego.Router("/api/get-trace", &controllers.ApiController{}, "GET:GetTrace")

	beego.Router("/api/list-rules", &controllers.ApiController{}, "GET:ListRules")
	beego.Router("/api/upload-file", &controllers.ApiController{}, "POST:UploadFile")

	beego.Router("/api/get-websites", &controllers.ApiController{}, "GET:GetWebsites")
	beego.Router("/api/get-website", &controllers.ApiController{}, "GET:GetWebsite")
	beego.Router("/api/update-website", &controllers.ApiController{}, "POST:UpdateWebsite")
	beego.Router("/api/add-website", &controllers.ApiController{}, "POST:AddWebsite")
	beego.Router("/api/delete-website", &controllers.ApiController{}, "POST:DeleteWebsite")

	beego.Router("/api/get-sessions", &controllers.ApiController{}, "GET:GetSessions")
	beego.Router("/api/get-session", &controllers.ApiController{}, "GET:GetSession")
	beego.Router("/api/delete-session", &controllers.ApiController{}, "POST:DeleteSession")

	beego.Router("/api/get-impressions", &controllers.ApiController{}, "GET:GetImpressions")
	beego.Router("/api/get-impression", &controllers.ApiController{}, "GET:GetImpression")
	beego.Router("/api/delete-impression", &controllers.ApiController{}, "POST:DeleteImpression")
}
