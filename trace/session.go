// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package trace

import (
	"strings"

	"xorm.io/core"
)

type Session struct {
	Id          string `xorm:"varchar(100) notnull pk" json:"id"`
	WebsiteId   string `xorm:"varchar(100) notnull pk" json:"websiteId"`
	CreatedTime string `xorm:"varchar(100)" json:"createdTime"`
	UserAgent   string `xorm:"varchar(500)" json:"userAgent"`
	ClientIp    string `xorm:"varchar(100)" json:"clientIp"`
	UserId      string `xorm:"varchar(100)" json:"userId"`

	ImpressionCount int `json:"impressionCount"`

	Traces   []*Trace       `json:"traces"`
	TraceMap map[int]*Trace `json:"-"`

	TN int `json:"tn"`
	FP int `json:"fp"`
	FN int `json:"fn"`
	TP int `json:"tp"`
	UN int `json:"un"`
}

func countImpressions(session *Session) {
	impressionCount, err := ormManager.engine.Where("session_id = ?", session.Id).And("website_id = ?", session.WebsiteId).Count(&Impression{})
	if err != nil {
		panic(err)
	}
	session.ImpressionCount = int(impressionCount)
	// TODO: Do we need to update `impression_count` column?
}

func countImpressionsForSessions(sessions []*Session) {
	for _, session := range sessions {
		countImpressions(session)
	}
}

func GetSessions(websiteId string, resultCount int, offset int, sortField string, sortOrder string) []*Session {
	sessions := []*Session{}
	var err error
	if sortField != "" {
		if sortOrder == "1" {
			err = ormManager.engine.Where("website_id = ?", websiteId).Asc(sortField).Limit(resultCount, offset).Find(&sessions)
		} else {
			err = ormManager.engine.Where("website_id = ?", websiteId).Desc(sortField).Limit(resultCount, offset).Find(&sessions)
		}
	} else {
		err = ormManager.engine.Where("website_id = ?", websiteId).Asc("created_time").Limit(resultCount, offset).Find(&sessions)
	}
	if err != nil {
		panic(err)
	}

	countImpressionsForSessions(sessions)

	return sessions
}

func GetSession(id string, websiteId string) *Session {
	s := Session{Id: id, WebsiteId: websiteId}
	existed, err := ormManager.engine.Get(&s)
	if err != nil {
		panic(err)
	}

	if existed {
		countImpressions(&s)
		return &s
	} else {
		return nil
	}
}

func updateSession(id string, websiteId string, session *Session) bool {
	affected, err := ormManager.engine.Id(core.PK{id, websiteId}).Cols("user_id").Update(session)
	if err != nil {
		panic(err)
	}

	return affected != 0
}

func AddSession(id string, websiteId string, userAgent string, clientIp string, userId string) bool {
	s := Session{Id: id, WebsiteId: websiteId, CreatedTime: getCurrentTime(), UserAgent: userAgent, ClientIp: clientIp, UserId: userId}
	affected, err := ormManager.engine.Insert(s)
	if err != nil {
		if strings.Contains(err.Error(), "Duplicate entry") && userId != "" {
			updateSession(id, websiteId, &s)
		} else {
			panic(err)
		}
	}

	return affected != 0
}

func AddSessions(sessions []*Session) bool {
	affected, err := ormManager.engine.Insert(sessions)
	if err != nil && !strings.Contains(err.Error(), "Duplicate entry") {
		panic(err)
	}

	return affected != 0
}

func DeleteSession(id string, websiteId string) bool {
	affected, err := ormManager.engine.Id(core.PK{id, websiteId}).Delete(&Session{})
	if err != nil {
		panic(err)
	}

	return affected != 0
}

func DeleteSessions(websiteId string) bool {
	affected, err := ormManager.engine.Where("website_id = ?", websiteId).Delete(&Session{})
	if err != nil {
		panic(err)
	}

	return affected != 0
}

func NewSession(id string) *Session {
	ss := Session{}
	ss.Id = id
	ss.Traces = []*Trace{}

	ss.TraceMap = map[int]*Trace{}
	return &ss
}

func (ss *Session) AddTrace(t *Trace) {
	id := t.Id
	if tOriginal, ok := ss.TraceMap[id]; !ok {
		ss.TraceMap[id] = t
		ss.Traces = append(ss.Traces, t)
	} else {
		tOriginal.Events = append(tOriginal.Events, t.Events...)
	}
}

func (ss *Session) ToJson() *SessionJson {
	ruleCounts := []int{}
	for i := 0; i < 8; i++ {
		ruleCounts = append(ruleCounts, 0)
	}
	for _, t := range ss.Traces {
		ruleCounts[t.RuleId] += 1
	}

	sj := SessionJson{
		Id:         ss.Id,
		TraceSize:  len(ss.Traces),
		TN:         ss.TN,
		FP:         ss.FP,
		FN:         ss.FN,
		TP:         ss.TP,
		UN:         ss.UN,
		RuleCounts: ruleCounts,
	}
	return &sj
}
