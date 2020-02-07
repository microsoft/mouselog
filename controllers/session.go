package controllers

import "github.com/microsoft/mouselog/trace"

func (c *ApiController) GetSessions() {
	c.Data["json"] = trace.GetSessions(c.Input().Get("websiteId"))
	c.ServeJSON()
}

func (c *ApiController) GetSession() {
	c.Data["json"] = trace.GetSession(c.Input().Get("id"), c.Input().Get("websiteId"))
	c.ServeJSON()
}

func (c *ApiController) DeleteSession() {
	c.Data["json"] = trace.DeleteSession(c.Input().Get("id"), c.Input().Get("websiteId"))
	c.ServeJSON()
}
