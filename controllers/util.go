// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package controllers

func (c *APIController) getUserAgent() string {
	return c.Ctx.Input.UserAgent()
}

func (c *APIController) getClientIp() string {
	return c.Ctx.Input.IP()
}
