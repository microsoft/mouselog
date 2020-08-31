// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package controllers

import (
	"encoding/json"

	"github.com/microsoft/mouselog/object"
)

func (c *ApiController) GetFakers() {
	c.Data["json"] = object.GetFakers()
	c.ServeJSON()
}

func (c *ApiController) GetFaker() {
	id := c.Input().Get("id")

	c.Data["json"] = object.GetFaker(id)
	c.ServeJSON()
}

func (c *ApiController) UpdateFaker() {
	id := c.Input().Get("id")

	var faker object.Faker
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &faker)
	if err != nil {
		panic(err)
	}

	c.Data["json"] = object.UpdateFaker(id, &faker)
	c.ServeJSON()
}

func (c *ApiController) AddFaker() {
	var faker object.Faker
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &faker)
	if err != nil {
		panic(err)
	}

	c.Data["json"] = object.AddFaker(&faker)
	c.ServeJSON()
}

func (c *ApiController) DeleteFaker() {
	var faker object.Faker
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &faker)
	if err != nil {
		panic(err)
	}

	c.Data["json"] = object.DeleteFaker(&faker)
	c.ServeJSON()
}
