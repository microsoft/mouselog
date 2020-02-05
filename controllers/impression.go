package controllers

import "github.com/microsoft/mouselog/trace"

func (c *ApiController) GetImpressions() {
	sessionId := c.Input().Get("sessionId")

	c.Data["json"] = trace.GetImpressions(sessionId)
	c.ServeJSON()
}

func (c *ApiController) GetImpression() {
	id := c.Input().Get("id")

	c.Data["json"] = trace.GetImpression(id)
	c.ServeJSON()
}

func (c *ApiController) DeleteImpression() {
	id := c.Input().Get("id")

	c.Data["json"] = trace.DeleteImpression(id)
	c.ServeJSON()
}
