package controllers

import (
	"encoding/json"
	"fmt"

	"github.com/astaxie/beego"
	"github.com/mouselog/mouselog-server/trace"
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

	//fmt.Printf("Read event [%s]: %s\n", sessionId, string(data))

	var events trace.Events
	err := json.Unmarshal(data, &events)
	if err != nil {
		panic(err)
	}

	ss := getOrCreateSs(sessionId)
	ss.AddEvents(&events)

	fmt.Printf("Read event [%s]: (%s, %f, %d, %d)\n", sessionId, events.Url, events.Data[0].Timestamp, events.Data[0].X, events.Data[0].Y)

	c.Data["json"] = ss.ToString()
	c.ServeJSON()
}
