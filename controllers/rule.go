package controllers

import "github.com/microsoft/mouselog/detect"

func (c *ApiController) ListRules() {
	c.Data["json"] = detect.GetRuleListJson()
	c.ServeJSON()
}
