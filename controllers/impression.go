// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package controllers

import "github.com/microsoft/mouselog/trace"

func (c *APIController) GetImpressions() {
	c.Data["json"] = trace.GetImpressions(c.Input().Get("sessionId"))
	c.ServeJSON()
}

func (c *APIController) GetImpression() {
	c.Data["json"] = trace.GetImpression(c.Input().Get("id"))
	c.ServeJSON()
}

func (c *APIController) DeleteImpression() {
	c.Data["json"] = trace.DeleteImpression(c.Input().Get("id"))
	c.ServeJSON()
}
