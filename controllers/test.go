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

	websiteID := c.Input().Get("websiteId")
	sessionID := c.StartSession().SessionID()
	impressionID := c.Input().Get("impressionId")
	userAgent := c.Ctx.Input.UserAgent()
	clientID := c.Ctx.Input.IP()

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

	trace.AddSession(sessionID, websiteID, userAgent, clientID)
	trace.AddImpression(impressionID, sessionID, t.Path)
	trace.AppendTraceToImpression(impressionID, &t)

	// Only return traces for test page for visualization (websiteId == "mouselog")
	if websiteID != "mouselog" {
		resp = response{Status: "ok", Msg: "", Data: ""}
		if len(t.Events) == 0 {
			resp.Msg = "config"
			resp.Data = trace.ParseTrackConfig(trace.GetWebsite(websiteID).TrackConfig)
		}

		c.Data["json"] = resp
		c.ServeJSON()
		return
	}

	ss, _ := Session(sessionID)
	if len(t.Events) > 0 {
		fmt.Printf("Read event [%s]: (%s, %f, %d, %d)\n", sessionID, t.Id, t.Events[0].Timestamp, t.Events[0].X, t.Events[0].Y)
	} else {
		fmt.Printf("Read event [%s]: (%s, <empty>)\n", sessionID, t.Id)
	}

	if len(t.Events) != 0 {
		ss.AddTrace(&t)
	}

	c.Data["json"] = detect.GetDetectResult(ss, t.Id)
	c.ServeJSON()
}

func (c *APIController) ClearTrace() {
	sessionID := c.StartSession().SessionID()
	data := c.Ctx.Input.RequestBody

	var t trace.Trace
	err := json.Unmarshal(data, &t)
	if err != nil {
		panic(err)
	}

	ss, _ := Session(sessionID)
	if t2, ok := ss.TraceMap[t.Id]; ok {
		delete(ss.TraceMap, t.Id)
		for i, t3 := range ss.Traces {
			if t2 == t3 {
				ss.Traces = append(ss.Traces[:i], ss.Traces[i+1:]...)
			}
		}
	}

	fmt.Printf("Clear event [%s]: (%s, <empty>)\n", sessionID, t.Id)

	c.Data["json"] = detect.GetDetectResult(ss, t.Id)
	c.ServeJSON()
}
