// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package controllers

import (
	"path/filepath"

	"github.com/astaxie/beego"
	"github.com/microsoft/mouselog/trace"
	"github.com/microsoft/mouselog/util"
)

var sessions map[string]*trace.Session

func init() {
	sessions = map[string]*trace.Session{}
}

type SessionController struct {
	beego.Controller
}

func (c *SessionController) DeleteSession() {
	c.Data["json"] = trace.DeleteSession(c.Input().Get("id"), c.Input().Get("websiteId"))
	c.ServeJSON()
}

func (c *SessionController) Session() {
	c.Data["json"] = trace.GetSession(c.Input().Get("id"), c.Input().Get("websiteId"))
	c.ServeJSON()
}

func (c *SessionController) SessionID() {
	sessionID := c.StartSession().SessionID()

	trace.AddSession(sessionID, c.Input().Get("websiteId"), c.Ctx.Input.UserAgent(), c.Ctx.Input.IP())

	c.Data["json"] = sessionID
	c.ServeJSON()
}

func (c *SessionController) Sessions() {
	c.Data["json"] = trace.GetSessions(c.Input().Get("websiteId"), util.ParseInt(c.Input().Get("resultCount")), util.ParseInt(c.Input().Get("offset")), c.Input().Get("sortField"), c.Input().Get("sortOrder"))
	c.ServeJSON()
}

func (c *SessionController) ListSessions() {
	path := filepath.Join(util.CacheDir, "mouselog")
	res := []*trace.SessionJson{}
	for _, ss := range traceFiles(path) {
		res = append(res, ss.ToJson())
	}

	c.Data["json"] = res
	c.ServeJSON()
}

// Session either returns an already existing session or creates and returns a new one.
// If a new session has been created, the returned boolean will be true.
func Session(sessionID string) (*trace.Session, bool) {
	if val, ok := sessions[sessionID]; ok {
		return val, false
	}

	sessions[sessionID] = trace.NewSession(sessionID)
	return sessions[sessionID], true
}
