package routers

import (
	"github.com/astaxie/beego"

	"github.com/microsoft/mouselog/controllers"
)

func init() {
	ns :=
		beego.NewNamespace("/api",
			beego.NSInclude(
				&controllers.SessionController{},
				&controllers.APIController{},
			),
		)
	beego.AddNamespace(ns)

	beego.Router("/api/get-session-id", &controllers.SessionController{}, "GET:SessionID")
	beego.Router("/api/list-sessions", &controllers.SessionController{}, "GET:ListSessions")
	beego.Router("/api/get-sessions", &controllers.SessionController{}, "GET:Sessions")
	beego.Router("/api/get-session", &controllers.SessionController{}, "GET:Session")
	beego.Router("/api/delete-session", &controllers.SessionController{}, "POST:DeleteSession")

	beego.Router("/api/upload-trace", &controllers.APIController{}, "POST:UploadTrace")
	beego.Router("/api/upload-trace", &controllers.APIController{}, "GET:UploadTrace")
	beego.Router("/api/clear-trace", &controllers.APIController{}, "POST:ClearTrace")
	beego.Router("/api/list-traces", &controllers.APIController{}, "GET:ListTraces")
	beego.Router("/api/get-trace", &controllers.APIController{}, "GET:GetTrace")

	beego.Router("/api/list-rules", &controllers.APIController{}, "GET:ListRules")
	beego.Router("/api/upload-file", &controllers.APIController{}, "POST:UploadFile")

	beego.Router("/api/get-websites", &controllers.APIController{}, "GET:GetWebsites")
	beego.Router("/api/get-website", &controllers.APIController{}, "GET:GetWebsite")
	beego.Router("/api/update-website", &controllers.APIController{}, "POST:UpdateWebsite")
	beego.Router("/api/add-website", &controllers.APIController{}, "POST:AddWebsite")
	beego.Router("/api/delete-website", &controllers.APIController{}, "POST:DeleteWebsite")

	beego.Router("/api/get-impressions", &controllers.APIController{}, "GET:GetImpressions")
	beego.Router("/api/get-impression", &controllers.APIController{}, "GET:GetImpression")
	beego.Router("/api/delete-impression", &controllers.APIController{}, "POST:DeleteImpression")
}
