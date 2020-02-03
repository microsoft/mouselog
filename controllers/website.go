package controllers

import (
	"encoding/json"

	"github.com/microsoft/mouselog/trace"
)

func (c *ApiController) GetWebsites() {
	c.Data["json"] = trace.GetWebsites()
	c.ServeJSON()
}

func (c *ApiController) UpdateWebsite() {
	id := c.Input().Get("id")

	var website trace.Website
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &website)
	if err != nil {
		panic(err)
	}

	c.Data["json"] = trace.UpdateWebsite(id, &website)
	c.ServeJSON()
}

func (c *ApiController) AddWebsite() {
	var website trace.Website
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &website)
	if err != nil {
		panic(err)
	}

	c.Data["json"] = trace.AddWebsite(&website)
	c.ServeJSON()
}

func (c *ApiController) DeleteWebsite() {
	var website trace.Website
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &website)
	if err != nil {
		panic(err)
	}

	c.Data["json"] = trace.DeleteWebsite(&website)
	c.ServeJSON()
}
