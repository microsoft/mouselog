// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package controllers

import (
	"encoding/json"
	"fmt"

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

func (c *APIController) UploadTrace() {
	var resp response

	websiteId := c.Input().Get("websiteId")
	sessionId := c.StartSession().SessionID()
	impressionId := c.Input().Get("impressionId")
	userAgent := c.getUserAgent()
	clientIp := c.getClientIp()
	userId := c.Input().Get("userId")

	website := trace.GetWebsite(websiteId)
	if website == nil {
		resp = response{Status: "ok", Msg: "this website is not monitored", Data: ""}

		c.Data["json"] = resp
		c.ServeJSON()
		return
	}

	var data []byte
	if c.Ctx.Request.Method == "GET" {
		data = []byte(c.Input().Get("data"))
	} else { // Method == "POST"
		data = c.Ctx.Input.RequestBody
	}

	var t trace.Trace
	err := json.Unmarshal(data, &t)
	if err != nil {
		panic(err)
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
		fmt.Printf("Read event [%s]: (%s, %f, %d, %d)\n", sessionId, t.Id, t.Events[0].Timestamp, t.Events[0].X, t.Events[0].Y)
	} else {
		fmt.Printf("Read event [%s]: (%s, <empty>)\n", sessionId, t.Id)
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
