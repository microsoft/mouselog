// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package trace

import "strings"

type Impression struct {
	Id          string `xorm:"varchar(100) notnull pk" json:"id"`
	SessionId   string `xorm:"varchar(100)" json:"sessionId"`
	WebsiteId   string `xorm:"varchar(100)" json:"websiteId"`
	CreatedTime string `xorm:"varchar(100)" json:"createdTime"`
	UrlPath     string `xorm:"varchar(500)" json:"urlPath"`

	Width        int    `json:"width"`
	Height       int    `json:"height"`
	PageLoadTime string `xorm:"varchar(100)" json:"pageLoadTime"`

	UserAgent string `xorm:"varchar(500)" json:"userAgent"`
	ClientIp  string `xorm:"varchar(100)" json:"clientIp"`
	UserId    string `xorm:"varchar(100)" json:"userId"`

	Events []Event `xorm:"mediumtext" json:"events"`
}

func GetImpressions(websiteId string, sessionId string, resultCount int, offset int, sortField string, sortOrder string) []*Impression {
	impressions := []*Impression{}
	var err error

	if sortField != "" {
		if sortOrder == "1" {
			err = ormManager.engine.Where("session_id = ?", sessionId).And("website_id = ?", websiteId).Asc(sortField).Limit(resultCount, offset).Find(&impressions)
		} else {
			err = ormManager.engine.Where("session_id = ?", sessionId).And("website_id = ?", websiteId).Desc(sortField).Limit(resultCount, offset).Find(&impressions)
		}
	} else {
		err = ormManager.engine.Where("session_id = ?", sessionId).And("website_id = ?", websiteId).Asc("created_time").Limit(resultCount, offset).Find(&impressions)
	}
	if err != nil {
		panic(err)
	}

	return impressions
}

func GetImpressionsAll(websiteId string, resultCount int, offset int, sortField string, sortOrder string) []*Impression {
	impressions := []*Impression{}
	var err error

	if sortField != "" {
		if sortOrder == "1" {
			err = ormManager.engine.Where("website_id = ?", websiteId).Asc(sortField).Limit(resultCount, offset).Find(&impressions)
		} else {
			err = ormManager.engine.Where("website_id = ?", websiteId).Desc(sortField).Limit(resultCount, offset).Find(&impressions)
		}
	} else {
		err = ormManager.engine.Where("website_id = ?", websiteId).Asc("created_time").Limit(resultCount, offset).Find(&impressions)
	}
	if err != nil {
		panic(err)
	}

	return impressions
}

func GetImpression(id string) *Impression {
	im := Impression{Id: id}
	existed, err := ormManager.engine.Get(&im)
	if err != nil {
		panic(err)
	}

	if existed {
		return &im
	} else {
		return nil
	}
}

func updateImpression(id string, impression *Impression) bool {
	if GetImpression(id) == nil {
		return false
	}

	_, err := ormManager.engine.Id(id).AllCols().Update(impression)
	if err != nil {
		panic(err)
	}

	//return affected != 0
	return true
}

func AddImpression(id string, sessionId string, websiteId string, userId string, urlPath string) bool {
	im := Impression{Id: id, SessionId: sessionId, WebsiteId: websiteId, UserId: userId, CreatedTime: getCurrentTime(), UrlPath: urlPath, Events: []Event{}}
	affected, err := ormManager.engine.Insert(im)
	if err != nil && !strings.Contains(err.Error(), "Duplicate entry") {
		panic(err)
	}

	return affected != 0
}

func AddImpressions(impressions []*Impression) bool {
	affected, err := ormManager.engine.Insert(impressions)
	if err != nil && !strings.Contains(err.Error(), "Duplicate entry") {
		panic(err)
	}

	return affected != 0
}

func DeleteImpression(id string) bool {
	affected, err := ormManager.engine.Id(id).Delete(&Impression{})
	if err != nil {
		panic(err)
	}

	return affected != 0
}

func DeleteImpressions(websiteId string) bool {
	affected, err := ormManager.engine.Where("website_id = ?", websiteId).Delete(&Impression{})
	if err != nil {
		panic(err)
	}

	return affected != 0
}

func AppendTraceToImpression(id string, trace *Trace) {
	if len(trace.Events) == 0 {
		return
	}
	impressionMapMutex.TryLock(id)

	impression := GetImpression(id)

	impression.Width = trace.Width
	impression.Height = trace.Height
	impression.PageLoadTime = trace.PageLoadTime

	// Merge Sort
	impEvtCount := len(impression.Events)
	if impEvtCount == 0 || impression.Events[impEvtCount-1].Id < trace.Events[0].Id {
		impression.Events = append(impression.Events, trace.Events...)
	} else {
		var tmp []Event
		i := 0
		for {
			if impression.Events[i].Id < trace.Events[0].Id {
				i++
			} else {
				break
			}
		}
		tmp = append(tmp, impression.Events[:i]...)
		tmp = append(tmp, trace.Events...)
		impression.Events = append(tmp, impression.Events[i:]...)
	}

	updateImpression(id, impression)

	impressionMapMutex.Unlock(id)
}
