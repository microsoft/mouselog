// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package routers

import (
	"github.com/astaxie/beego"

	"github.com/microsoft/mouselog/controllers"
)

func init() {
	ns :=
		beego.NewNamespace("/api",
			beego.NSInclude(
				&controllers.ApiController{},
			),
		)
	beego.AddNamespace(ns)

	beego.Router("/api/get-session-id", &controllers.ApiController{}, "GET:GetSessionId")
	beego.Router("/api/get-sessions", &controllers.ApiController{}, "GET:GetSessions")
	beego.Router("/api/get-session", &controllers.ApiController{}, "GET:GetSession")
	beego.Router("/api/delete-session", &controllers.ApiController{}, "POST:DeleteSession")

	// For mouselog dashboard, /api/upload-trace requires websiteId, userId, impressionId
	// For other pages, /api/upload-trace requires websiteId, userId, impressionId and sessionId
	beego.Router("/api/upload-trace", &controllers.ApiController{}, "POST:UploadTrace")
	beego.Router("/api/upload-trace", &controllers.ApiController{}, "GET:UploadTrace")
	beego.Router("/api/clear-trace", &controllers.ApiController{}, "POST:ClearTrace")

	beego.Router("/api/list-datasets", &controllers.ApiController{}, "GET:ListDatasets")

	beego.Router("/api/list-rules", &controllers.ApiController{}, "GET:ListRules")

	beego.Router("/api/get-websites", &controllers.ApiController{}, "GET:GetWebsites")
	beego.Router("/api/get-website", &controllers.ApiController{}, "GET:GetWebsite")
	beego.Router("/api/update-website", &controllers.ApiController{}, "POST:UpdateWebsite")
	beego.Router("/api/add-website", &controllers.ApiController{}, "POST:AddWebsite")
	beego.Router("/api/delete-website", &controllers.ApiController{}, "POST:DeleteWebsite")

	beego.Router("/api/get-impressions", &controllers.ApiController{}, "GET:GetImpressions")
	beego.Router("/api/get-impressions-all", &controllers.ApiController{}, "GET:GetImpressionsAll")
	beego.Router("/api/get-impression", &controllers.ApiController{}, "GET:GetImpression")
	beego.Router("/api/delete-impression", &controllers.ApiController{}, "POST:DeleteImpression")

	beego.Router("/api/get-pages", &controllers.ApiController{}, "GET:GetPages")
	beego.Router("/api/get-page", &controllers.ApiController{}, "GET:GetPage")
	beego.Router("/api/update-page", &controllers.ApiController{}, "POST:UpdatePage")
	beego.Router("/api/add-page", &controllers.ApiController{}, "POST:AddPage")
	beego.Router("/api/delete-page", &controllers.ApiController{}, "POST:DeletePage")
}
