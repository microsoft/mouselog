// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package controllers

func (c *ApiController) getUserAgent() string {
	return c.Ctx.Input.UserAgent()
}

func (c *ApiController) getClientIp() string {
	return c.Ctx.Input.IP()
}
