package controllers

import "github.com/microsoft/mouselog/trace"

func (c *ApiController) GetSessions() {
	websiteId := c.Input().Get("websiteId")

	c.Data["json"] = trace.GetSessions(websiteId)
	c.ServeJSON()
}

func (c *ApiController) GetSession() {
	id := c.Input().Get("id")
	websiteId := c.Input().Get("websiteId")

	c.Data["json"] = trace.GetSession(id, websiteId)
	c.ServeJSON()
}

func (c *ApiController) DeleteSession() {
	id := c.Input().Get("id")
	websiteId := c.Input().Get("websiteId")

	c.Data["json"] = trace.DeleteSession(id, websiteId)
	c.ServeJSON()
}
