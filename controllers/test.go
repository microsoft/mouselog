package controllers

import (
	"encoding/json"
	"fmt"

	"github.com/astaxie/beego"

	"github.com/mouselog/mouselog/trace"
)

type ApiController struct {
	beego.Controller
}

var ssm map[string]*trace.Session

func init() {
	ssm = map[string]*trace.Session{}
}

func getOrCreateSs(sessionId string) *trace.Session {
	var ss *trace.Session

	if _, ok := ssm[sessionId]; ok {
		ss = ssm[sessionId]
	} else {
		ss = trace.NewSession(sessionId)
		ssm[sessionId] = ss
	}

	return ss
}

func (c *ApiController) GetSessionId() {
	c.Data["json"] = c.StartSession().SessionID()
	c.ServeJSON()
}

func (c *ApiController) UploadTrace() {
	sessionId := c.StartSession().SessionID()
	//sessionId := c.Input().Get("sessionId")
	data := c.Ctx.Input.RequestBody

	var events trace.Events
	err := json.Unmarshal(data, &events)
	if err != nil {
		panic(err)
	}

	ss := getOrCreateSs(sessionId)
	if len(events.Data) > 0 {
		fmt.Printf("Read event [%s]: (%s, %f, %d, %d)\n", sessionId, events.Url, events.Data[0].Timestamp, events.Data[0].X, events.Data[0].Y)
	} else {
		fmt.Printf("Read event [%s]: (%s, <empty>)\n", sessionId, events.Url)
	}

	if len(events.Data) != 0 {
		ss.AddEvents(&events)
	}

	c.Data["json"] = ss.GetDetectResult(events.Url)
	c.ServeJSON()
}

func (c *ApiController) ClearTrace() {
	sessionId := c.StartSession().SessionID()
	//sessionId := c.Input().Get("sessionId")
	data := c.Ctx.Input.RequestBody

	var events trace.Events
	err := json.Unmarshal(data, &events)
	if err != nil {
		panic(err)
	}

	ss := getOrCreateSs(sessionId)
	if es, ok := ss.UrlMap[events.Url]; ok {
		delete(ss.UrlMap, events.Url)
		for i, es2 := range ss.Traces {
			if es == es2 {
				ss.Traces = append(ss.Traces[:i], ss.Traces[i+1:]...)
			}
		}
	}

	fmt.Printf("Clear event [%s]: (%s, <empty>)\n", sessionId, events.Url)

	c.Data["json"] = ss.GetDetectResult(events.Url)
	c.ServeJSON()
}
