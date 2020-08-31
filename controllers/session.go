// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package controllers

import (
	"github.com/microsoft/mouselog/object"
	"github.com/microsoft/mouselog/util"
)

func (c *ApiController) GetSessions() {
	c.Data["json"] = object.GetSessions(c.Input().Get("websiteId"), util.ParseInt(c.Input().Get("resultCount")), util.ParseInt(c.Input().Get("offset")), c.Input().Get("sortField"), c.Input().Get("sortOrder"))
	c.ServeJSON()
}

func (c *ApiController) GetSession() {
	c.Data["json"] = object.GetSession(c.Input().Get("id"), c.Input().Get("websiteId"))
	c.ServeJSON()
}

func (c *ApiController) GetSessionId() {
	sessionId := c.StartSession().SessionID()

	//trace.AddSession(sessionId, c.Input().Get("websiteId"), c.getUserAgent(), c.getClientIp(), c.Input().Get("userId"))

	c.Data["json"] = sessionId
	c.ServeJSON()
}

func (c *ApiController) DeleteSession() {
	c.Data["json"] = object.DeleteSession(c.Input().Get("id"), c.Input().Get("websiteId"))
	c.ServeJSON()
}
