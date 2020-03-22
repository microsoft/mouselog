// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package controllers

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/astaxie/beego"
	"github.com/microsoft/mouselog/detect"
	"github.com/microsoft/mouselog/trace"
)

type APIController struct {
	beego.Controller
}

type response struct {
	Status string      `json:"status"`
	Msg    string      `json:"msg"`
	Data   interface{} `json:"data"`
}

func base64Decode(src []byte) ([]byte, error) {
	return base64.StdEncoding.DecodeString(string(src))
}

func (c *APIController) UploadTrace() {
	var resp response

	websiteId := c.Input().Get("websiteId")
	sessionId := c.Input().Get("sessionId")

	impressionId := c.Input().Get("impressionId")
	userAgent := c.getUserAgent()
	clientIp := c.getClientIp()
	userId := c.Input().Get("userId")

	beegoSessionId := c.StartSession().SessionID()
	if sessionId == "" {
		sessionId = beegoSessionId
	}

	website := trace.GetWebsite(websiteId)
	if website == nil {
		resp = response{Status: "ok", Msg: "this website is not monitored", Data: ""}

		c.Data["json"] = resp
		c.ServeJSON()
		return
	}

	trackConfig := trace.ParseTrackConfig(website.TrackConfig)

	var data []byte
	if c.Ctx.Request.Method == "GET" {
		data = []byte(c.Input().Get("data"))
	} else { // Method == "POST"
		data = c.Ctx.Input.RequestBody
	}

	if len(data) == 0 {
		resp = response{Status: "ok", Msg: "", Data: ""}
		resp.Msg = "config"
		resp.Data = trace.ParseTrackConfig(trace.GetWebsite(websiteId).TrackConfig)

		c.Data["json"] = resp
		c.ServeJSON()
		return
	}

	if trackConfig.Encoder == "base64" {
		var err error
		data, err = base64Decode(data)
		if err != nil {
			panic(err)
		}
	}

	var t trace.Trace
	err := json.Unmarshal(data, &t)
	if err != nil {
		panic(err)
	}

	referrer := t.Referrer
	isDashboardUser := strings.HasPrefix(referrer, "http://localhost") || strings.HasPrefix(referrer, "https://mouselog.org")
	fmt.Printf("%s, %s, %s, %s, isDashboardUser=%v\n", websiteId, sessionId, impressionId, referrer, isDashboardUser)
	if isDashboardUser {
		resp = response{Status: "ok", Msg: "dashboard user is not monitored", Data: ""}

		c.Data["json"] = resp
		c.ServeJSON()
		return
	}

	trace.AddSession(sessionId, websiteId, userAgent, clientIp, userId)
	trace.AddImpression(impressionId, sessionId, websiteId, userId, t.Path)
	trace.AppendTraceToImpression(impressionId, &t)

	// Only return traces for test page for visualization (websiteId == "mouselog")
	if websiteId != "mouselog" {
		resp = response{Status: "ok", Msg: "", Data: ""}
		if len(t.Events) == 0 {
			resp.Msg = "config"
			resp.Data = trace.ParseTrackConfig(trace.GetWebsite(websiteId).TrackConfig)
		}

		c.Data["json"] = resp
		c.ServeJSON()
		return
	}

	ss, _ := GetOrCreateSession(sessionId)
	if len(t.Events) > 0 {
		fmt.Printf("Read event [%s]: (%d, %f, %d, %d)\n", sessionId, t.Id, t.Events[0].Timestamp, t.Events[0].X, t.Events[0].Y)
	} else {
		fmt.Printf("Read event [%s]: (%d, <empty>)\n", sessionId, t.Id)
	}

	if len(t.Events) != 0 {
		ss.AddTrace(&t)
	}

	c.Data["json"] = detect.GetDetectResult(ss, t.Id)
	c.ServeJSON()
}

func (c *APIController) ClearTrace() {
	sessionId := c.StartSession().SessionID()
	data := c.Ctx.Input.RequestBody

	var t trace.Trace
	err := json.Unmarshal(data, &t)
	if err != nil {
		panic(err)
	}

	ss, _ := GetOrCreateSession(sessionId)
	if t2, ok := ss.TraceMap[t.Id]; ok {
		delete(ss.TraceMap, t.Id)
		for i, t3 := range ss.Traces {
			if t2 == t3 {
				ss.Traces = append(ss.Traces[:i], ss.Traces[i+1:]...)
			}
		}
	}

	fmt.Printf("Clear event [%s]: (%s, <empty>)\n", sessionId, t.Id)

	c.Data["json"] = detect.GetDetectResult(ss, t.Id)
	c.ServeJSON()
}
