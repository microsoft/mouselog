package controllers

import (
	"encoding/json"
	"fmt"

	"github.com/astaxie/beego"

	"github.com/microsoft/mouselog/detect"
	"github.com/microsoft/mouselog/trace"
)

type ApiController struct {
	beego.Controller
}

var sessions map[string]*trace.Session

func init() {
	sessions = map[string]*trace.Session{}
}

// Session either returns an already existing session or creates and returns a new one.
// If a new session has been created, the returned boolean will be true.
func Session(sessionId string) (*trace.Session, bool) {
	if val, ok := sessions[sessionId]; ok {
		return val, false
	}

	sessions[sessionId] = trace.NewSession(sessionId)
	return sessions[sessionId], true
}

func (c *ApiController) GetSessionId() {
	sessionId := c.StartSession().SessionID()

	trace.AddSession(sessionId, c.Input().Get("websiteId"), c.Ctx.Input.UserAgent(), getClientIp(c.Ctx))

	c.Data["json"] = sessionId
	c.ServeJSON()
}

func (c *ApiController) UploadTrace() {
	websiteId := c.Input().Get("websiteId")
	sessionId := c.StartSession().SessionID()
	impressionId := c.Input().Get("impressionId")
	userAgent := c.Ctx.Input.UserAgent()
	clientIp := getClientIp(c.Ctx)

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

	trace.AddSession(sessionId, websiteId, userAgent, clientIp)
	trace.AddImpression(impressionId, sessionId, t.Path)
	trace.AppendTraceToImpression(impressionId, &t)

	if websiteId != "mouselog" {
		c.Data["json"] = "OK"
		c.ServeJSON()
		return
	}

	ss, _ := Session(sessionId)
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

func (c *ApiController) ClearTrace() {
	sessionId := c.StartSession().SessionID()
	data := c.Ctx.Input.RequestBody

	var t trace.Trace
	err := json.Unmarshal(data, &t)
	if err != nil {
		panic(err)
	}

	ss, _ := Session(sessionId)
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
