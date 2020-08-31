// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package controllers

import (
	"encoding/json"

	"github.com/microsoft/mouselog/trace"
)

func (c *ApiController) GetPages() {
	websiteId := c.Input().Get("websiteId")

	c.Data["json"] = trace.GetPages(websiteId)
	c.ServeJSON()
}

func (c *ApiController) GetPage() {
	id := c.Input().Get("id")

	c.Data["json"] = trace.GetPage(id)
	c.ServeJSON()
}

func (c *ApiController) UpdatePage() {
	id := c.Input().Get("id")

	var page trace.Page
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &page)
	if err != nil {
		panic(err)
	}

	c.Data["json"] = trace.UpdatePage(id, &page)
	c.ServeJSON()
}

func (c *ApiController) AddPage() {
	var page trace.Page
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &page)
	if err != nil {
		panic(err)
	}

	c.Data["json"] = trace.AddPage(&page)
	c.ServeJSON()
}

func (c *ApiController) DeletePage() {
	id := c.Input().Get("id")

	c.Data["json"] = trace.DeletePage(id)
	c.ServeJSON()
}
