package controllers

import "github.com/astaxie/beego/context"

func getUserAgent(ctx *context.Context) string {
	userAgent := ctx.Input.UserAgent()
	return userAgent
}

func getSessionId(c *ApiController) string {
	return c.StartSession().SessionID()
}
