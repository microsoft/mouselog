package controllers

import "github.com/astaxie/beego/context"

func getUserAgent(ctx *context.Context) string {
	userAgent := ctx.Input.UserAgent()
	return userAgent
}

func getClientIp(ctx *context.Context) string {
	clientIp := ctx.Input.IP()
	if clientIp == "" {
		clientIp = ctx.Request.Header.Get("x-forwarded-for")
	}

	return clientIp
}
