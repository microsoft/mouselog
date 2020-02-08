package controllers

import "github.com/microsoft/mouselog/detect"

func (c *APIController) ListRules() {
	c.Data["json"] = detect.GetRuleListJson()
	c.ServeJSON()
}
