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

	var t trace.Trace
	err := json.Unmarshal(data, &t)
	if err != nil {
		panic(err)
	}

	ss := getOrCreateSs(sessionId)
	if len(t.Data) > 0 {
		fmt.Printf("Read event [%s]: (%s, %f, %d, %d)\n", sessionId, t.Url, t.Data[0].Timestamp, t.Data[0].X, t.Data[0].Y)
	} else {
		fmt.Printf("Read event [%s]: (%s, <empty>)\n", sessionId, t.Url)
	}

	if len(t.Data) != 0 {
		ss.AddTrace(&t)
	}

	c.Data["json"] = ss.GetDetectResult(t.Url)
	c.ServeJSON()
}

func (c *ApiController) ClearTrace() {
	sessionId := c.StartSession().SessionID()
	//sessionId := c.Input().Get("sessionId")
	data := c.Ctx.Input.RequestBody

	var t trace.Trace
	err := json.Unmarshal(data, &t)
	if err != nil {
		panic(err)
	}

	ss := getOrCreateSs(sessionId)
	if t2, ok := ss.UrlMap[t.Url]; ok {
		delete(ss.UrlMap, t.Url)
		for i, t3 := range ss.Traces {
			if t2 == t3 {
				ss.Traces = append(ss.Traces[:i], ss.Traces[i+1:]...)
			}
		}
	}

	fmt.Printf("Clear event [%s]: (%s, <empty>)\n", sessionId, t.Url)

	c.Data["json"] = ss.GetDetectResult(t.Url)
	c.ServeJSON()
}
