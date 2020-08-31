// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package controllers

import (
	"encoding/json"

	"github.com/microsoft/mouselog/object"
)

func (c *ApiController) GetWebsites() {
	c.Data["json"] = object.GetWebsites()
	c.ServeJSON()
}

func (c *ApiController) GetWebsite() {
	id := c.Input().Get("id")

	c.Data["json"] = object.GetWebsite(id)
	c.ServeJSON()
}

func (c *ApiController) UpdateWebsite() {
	id := c.Input().Get("id")

	var website object.Website
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &website)
	if err != nil {
		panic(err)
	}

	c.Data["json"] = object.UpdateWebsite(id, &website)
	c.ServeJSON()
}

func (c *ApiController) AddWebsite() {
	var website object.Website
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &website)
	if err != nil {
		panic(err)
	}

	c.Data["json"] = object.AddWebsite(&website)
	c.ServeJSON()
}

func (c *ApiController) DeleteWebsite() {
	id := c.Input().Get("id")

	c.Data["json"] = object.DeleteWebsite(id)
	c.ServeJSON()
}
