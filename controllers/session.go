// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package controllers

import (
	"path/filepath"

	"github.com/microsoft/mouselog/trace"
	"github.com/microsoft/mouselog/util"
)

var sessions map[string]*trace.Session

func init() {
	sessions = map[string]*trace.Session{}
}

func (c *APIController) DeleteSession() {
	c.Data["json"] = trace.DeleteSession(c.Input().Get("id"), c.Input().Get("websiteId"))
	c.ServeJSON()
}

func (c *APIController) GetSession() {
	c.Data["json"] = trace.GetSession(c.Input().Get("id"), c.Input().Get("websiteId"))
	c.ServeJSON()
}

func (c *APIController) GetSessionId() {
	sessionId := c.StartSession().SessionID()

	//trace.AddSession(sessionId, c.Input().Get("websiteId"), c.getUserAgent(), c.getClientIp(), c.Input().Get("userId"))

	c.Data["json"] = sessionId
	c.ServeJSON()
}

func (c *APIController) GetSessions() {
	c.Data["json"] = trace.GetSessions(c.Input().Get("websiteId"), util.ParseInt(c.Input().Get("resultCount")), util.ParseInt(c.Input().Get("offset")), c.Input().Get("sortField"), c.Input().Get("sortOrder"))
	c.ServeJSON()
}

func (c *APIController) ListSessions() {
	path := filepath.Join(util.CacheDir, "mouselog")
	res := []*trace.SessionJson{}
	for _, ss := range traceFiles(path) {
		res = append(res, ss.ToJson())
	}

	c.Data["json"] = res
	c.ServeJSON()
}

// GetOrCreateSession either returns an already existing session or creates and returns a new one.
// If a new session has been created, the returned boolean will be true.
func GetOrCreateSession(sessionId string) (*trace.Session, bool) {
	if val, ok := sessions[sessionId]; ok {
		return val, false
	}

	sessions[sessionId] = trace.NewSession(sessionId)
	return sessions[sessionId], true
}
