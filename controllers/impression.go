// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package controllers

import (
	"github.com/microsoft/mouselog/detect"
	"github.com/microsoft/mouselog/trace"
	"github.com/microsoft/mouselog/util"
)

func getFilteredImpressions(impressions []*trace.Impression, ruleId int, limit int, offset int) []*trace.Impression {
	if ruleId != -1 {
		impressionsForRule := []*trace.Impression{}
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

func (c *APIController) GetImpressions() {
	ruleId := util.ParseInt(c.Input().Get("ruleId"))
	limit := util.ParseInt(c.Input().Get("resultCount"))
	offset := util.ParseInt(c.Input().Get("offset"))
	impressions := trace.GetImpressions(c.Input().Get("websiteId"), c.Input().Get("sessionId"), c.Input().Get("sortField"), c.Input().Get("sortOrder"))

	for _, impression := range impressions {
		detect.CheckBotForImpression(impression)
	}

	impressions = getFilteredImpressions(impressions, ruleId, limit, offset)

	c.Data["json"] = impressions
	c.ServeJSON()
}

func (c *APIController) GetImpressionsAll() {
	ruleId := util.ParseInt(c.Input().Get("ruleId"))
	limit := util.ParseInt(c.Input().Get("resultCount"))
	offset := util.ParseInt(c.Input().Get("offset"))
	impressions := trace.GetImpressionsAll(c.Input().Get("websiteId"), c.Input().Get("sortField"), c.Input().Get("sortOrder"))

	for _, impression := range impressions {
		detect.CheckBotForImpression(impression)
	}

	impressions = getFilteredImpressions(impressions, ruleId, limit, offset)

	c.Data["json"] = impressions
	c.ServeJSON()
}

func (c *APIController) GetImpression() {
	impression := trace.GetImpression(c.Input().Get("id"), c.Input().Get("websiteId"))

	detect.CheckBotForImpression(impression)

	c.Data["json"] = impression
	c.ServeJSON()
}

func (c *APIController) DeleteImpression() {
	c.Data["json"] = trace.DeleteImpression(c.Input().Get("id"))
	c.ServeJSON()
}
