package routers

import (
	"github.com/astaxie/beego"

	"github.com/microsoft/mouselog/controllers"
)

func init() {
	ns :=
		beego.NewNamespace("/api",
			beego.NSInclude(
				&controllers.APIController{},
			),
		)
	beego.AddNamespace(ns)

	beego.Router("/api/upload-trace", &controllers.APIController{}, "POST:UploadTrace")
	beego.Router("/api/upload-trace", &controllers.APIController{}, "GET:UploadTrace")

	beego.Router("/api/clear-trace", &controllers.APIController{}, "POST:ClearTrace")
	beego.Router("/api/get-session-id", &controllers.APIController{}, "GET:GetSessionId")

	beego.Router("/api/list-sessions", &controllers.APIController{}, "GET:ListSessions")
	beego.Router("/api/list-traces", &controllers.APIController{}, "GET:ListTraces")
	beego.Router("/api/get-trace", &controllers.APIController{}, "GET:GetTrace")

	beego.Router("/api/list-rules", &controllers.APIController{}, "GET:ListRules")
	beego.Router("/api/upload-file", &controllers.APIController{}, "POST:UploadFile")

	beego.Router("/api/get-websites", &controllers.APIController{}, "GET:GetWebsites")
	beego.Router("/api/get-website", &controllers.APIController{}, "GET:GetWebsite")
	beego.Router("/api/update-website", &controllers.APIController{}, "POST:UpdateWebsite")
	beego.Router("/api/add-website", &controllers.APIController{}, "POST:AddWebsite")
	beego.Router("/api/delete-website", &controllers.APIController{}, "POST:DeleteWebsite")

	beego.Router("/api/get-sessions", &controllers.APIController{}, "GET:GetSessions")
	beego.Router("/api/get-session", &controllers.APIController{}, "GET:GetSession")
	beego.Router("/api/delete-session", &controllers.APIController{}, "POST:DeleteSession")

	beego.Router("/api/get-impressions", &controllers.APIController{}, "GET:GetImpressions")
	beego.Router("/api/get-impression", &controllers.APIController{}, "GET:GetImpression")
	beego.Router("/api/delete-impression", &controllers.APIController{}, "POST:DeleteImpression")
}
