package controllers

import (
	"encoding/json"

	"github.com/microsoft/mouselog/trace"
)

func (c *APIController) GetWebsites() {
	c.Data["json"] = trace.GetWebsites()
	c.ServeJSON()
}

func (c *APIController) GetWebsite() {
	id := c.Input().Get("id")

	c.Data["json"] = trace.GetWebsite(id)
	c.ServeJSON()
}

func (c *APIController) UpdateWebsite() {
	id := c.Input().Get("id")

	var website trace.Website
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &website)
	if err != nil {
		panic(err)
	}

	c.Data["json"] = trace.UpdateWebsite(id, &website)
	c.ServeJSON()
}

func (c *APIController) AddWebsite() {
	var website trace.Website
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &website)
	if err != nil {
		panic(err)
	}

	c.Data["json"] = trace.AddWebsite(&website)
	c.ServeJSON()
}

func (c *APIController) DeleteWebsite() {
	id := c.Input().Get("id")

	c.Data["json"] = trace.DeleteWebsite(id)
	c.ServeJSON()
}
