package controllers

import (
	"encoding/json"

	"github.com/microsoft/mouselog/trace"
)

func (c *ApiController) GetWebsites() {
	c.Data["json"] = trace.GetWebsites()
	c.ServeJSON()
}

func (c *ApiController) UpdateWebsites() {
	var websites []*trace.Website
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &websites)
	if err != nil {
		panic(err)
	}

	c.Data["json"] = trace.UpdateWebsites(websites)
	c.ServeJSON()
}
