package controllers

import (
	"encoding/json"
	"fmt"

	"github.com/astaxie/beego"
)

type ApiController struct {
	beego.Controller
}

func (c *ApiController) UploadTrace() {
	sessionId := c.Input().Get("sessionId")
	//data := c.Input().Get("data")
	data := c.Ctx.Input.RequestBody

	//fmt.Printf("Read event [%s]: %s\n", sessionId, string(data))

	var events []Event
	err := json.Unmarshal(data, &events)
	if err != nil {
		panic(err)
	}
	fmt.Printf("Read event [%s]: (%f, %d, %d)\n", sessionId, events[0].Timestamp, events[0].X, events[0].Y)

	c.Data["json"] = "OK"
	c.ServeJSON()
}
