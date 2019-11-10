package main

import (
	"os"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/plugins/cors"

	_ "github.com/mouselog/mouselog/routers"
)

func main() {
	beego.InsertFilter("*", beego.BeforeRouter, cors.Allow(&cors.Options{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "PUT", "PATCH"},
		AllowHeaders:     []string{"Origin"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	beego.BConfig.WebConfig.Session.SessionProvider="file"
	beego.BConfig.WebConfig.Session.SessionProviderConfig = "./tmp"
	beego.BConfig.WebConfig.Session.SessionGCMaxLifetime = 3600 * 24 * 365

	port := "9000"
	if len(os.Args) > 1 {
		port = os.Args[1]
	}

	beego.Run("0.0.0.0:" + port)
}
