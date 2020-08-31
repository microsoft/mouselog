// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package controllers

import (
	"encoding/json"

	"github.com/microsoft/mouselog/object"
)

func (c *ApiController) GetCaptors() {
	c.Data["json"] = object.GetCaptors()
	c.ServeJSON()
}

func (c *ApiController) GetCaptor() {
	id := c.Input().Get("id")

	c.Data["json"] = object.GetCaptor(id)
	c.ServeJSON()
}

func (c *ApiController) UpdateCaptor() {
	id := c.Input().Get("id")

	var captor object.Captor
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &captor)
	if err != nil {
		panic(err)
	}

	c.Data["json"] = object.UpdateCaptor(id, &captor)
	c.ServeJSON()
}

func (c *ApiController) AddCaptor() {
	var captor object.Captor
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &captor)
	if err != nil {
		panic(err)
	}

	c.Data["json"] = object.AddCaptor(&captor)
	c.ServeJSON()
}

func (c *ApiController) DeleteCaptor() {
	var captor object.Captor
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &captor)
	if err != nil {
		panic(err)
	}

	c.Data["json"] = object.DeleteCaptor(&captor)
	c.ServeJSON()
}
