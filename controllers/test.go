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

var ssm map[string]*trace.Session

func init() {
	ssm = map[string]*trace.Session{}
}

func Session(sessionId string) (*trace.Session,bool) {
	if val, ok := ssm[sessionId]; ok {
		return val, false
	}

	ssm[sessionId] = trace.NewSession(sessionId)
	return ssm[sessionId], true
}

func (c *ApiController) GetSessionId() {
	websiteId := c.Input().Get("websiteId")
	sessionId := getSessionId(c)
	userAgent := getUserAgent(c.Ctx)
	clientIp := getClientIp(c.Ctx)

	trace.StartSession(sessionId, websiteId, userAgent, clientIp)

	c.Data["json"] = sessionId
	c.ServeJSON()
}

func (c *ApiController) UploadTrace() {
	websiteId := c.Input().Get("websiteId")
	sessionId := getSessionId(c)
	impressionId := c.Input().Get("impressionId")
	userAgent := getUserAgent(c.Ctx)
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

	trace.StartSession(sessionId, websiteId, userAgent, clientIp)
	trace.StartImpression(impressionId, sessionId, t.Path)
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
	sessionId := getSessionId(c)
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
