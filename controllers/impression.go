// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package controllers

import (
	"github.com/microsoft/mouselog/detect"
	"github.com/microsoft/mouselog/object"
	"github.com/microsoft/mouselog/util"
)

func getFilteredImpressions(impressions []*object.Impression, ruleId int, limit int, offset int) []*object.Impression {
	if ruleId != -1 {
		impressionsForRule := []*object.Impression{}
		for _, impression := range impressions {
			if impression.RuleId == ruleId {
				impressionsForRule = append(impressionsForRule, impression)
			}
		}
		impressions = impressionsForRule
	}

	last := limit * (offset + 1)
	if last > len(impressions) {
		last = len(impressions)
	}
	res := impressions[(limit * offset):last]
	return res
}

func (c *ApiController) GetImpressions() {
	ruleId := util.ParseInt(c.Input().Get("ruleId"))
	limit := util.ParseInt(c.Input().Get("resultCount"))
	offset := util.ParseInt(c.Input().Get("offset"))
	impressions := object.GetImpressions(c.Input().Get("websiteId"), c.Input().Get("sessionId"), c.Input().Get("sortField"), c.Input().Get("sortOrder"))

	for _, impression := range impressions {
		detect.CheckBotForImpression(impression)
	}

	impressions = getFilteredImpressions(impressions, ruleId, limit, offset)

	c.Data["json"] = impressions
	c.ServeJSON()
}

func (c *ApiController) GetImpressionsAll() {
	ruleId := util.ParseInt(c.Input().Get("ruleId"))
	limit := util.ParseInt(c.Input().Get("resultCount"))
	offset := util.ParseInt(c.Input().Get("offset"))
	impressions := object.GetImpressionsAll(c.Input().Get("websiteId"), c.Input().Get("sortField"), c.Input().Get("sortOrder"))

	for _, impression := range impressions {
		detect.CheckBotForImpression(impression)
	}

	impressions = getFilteredImpressions(impressions, ruleId, limit, offset)

	c.Data["json"] = impressions
	c.ServeJSON()
}

func (c *ApiController) GetImpression() {
	impression := object.GetImpression(c.Input().Get("id"), c.Input().Get("websiteId"))

	detect.CheckBotForImpression(impression)

	c.Data["json"] = impression
	c.ServeJSON()
}

func (c *ApiController) DeleteImpression() {
	c.Data["json"] = object.DeleteImpression(c.Input().Get("id"))
	c.ServeJSON()
}
