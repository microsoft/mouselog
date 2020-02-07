package controllers

import "github.com/microsoft/mouselog/trace"

func (c *ApiController) GetImpressions() {
	c.Data["json"] = trace.GetImpressions(c.Input().Get("sessionId"))
	c.ServeJSON()
}

func (c *ApiController) GetImpression() {
	c.Data["json"] = trace.GetImpression(c.Input().Get("id"))
	c.ServeJSON()
}

func (c *ApiController) DeleteImpression() {
	c.Data["json"] = trace.DeleteImpression(c.Input().Get("id"))
	c.ServeJSON()
}
