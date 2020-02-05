package trace

import "xorm.io/core"

type Session struct {
	Id          string `xorm:"varchar(100) notnull pk" json:"id"`
	WebsiteId   string `xorm:"varchar(100) notnull pk" json:"websiteId"`
	CreatedTime string `xorm:"varchar(100)" json:"createdTime"`
	UserAgent   string `xorm:"varchar(500)" json:"userAgent"`
	ClientIp    string `xorm:"varchar(100)" json:"clientIp"`

	Traces   []*Trace          `json:"traces"`
	TraceMap map[string]*Trace `json:"-"`

	TN int `json:"tn"`
	FP int `json:"fp"`
	FN int `json:"fn"`
	TP int `json:"tp"`
	UN int `json:"un"`
}

func GetSessions(websiteId string) []*Session {
	sessions := []*Session{}
	err := ormManager.engine.Where("website_id = ?", websiteId).Asc("created_time").Find(&sessions)
	if err != nil {
		panic(err)
	}

	return sessions
}

func GetSession(id string, websiteId string) *Session {
	s := Session{Id: id, WebsiteId: websiteId}
	existed, err := ormManager.engine.Get(&s)
	if err != nil {
		panic(err)
	}

	if existed {
		return &s
	} else {
		return nil
	}
}

func HasSession(id string, websiteId string) bool {
	return GetSession(id, websiteId) != nil
}

func AddSession(id string, websiteId string, userAgent string, clientIp string) bool {
	s := Session{Id: id, WebsiteId: websiteId, CreatedTime: getCurrentTime(), UserAgent: userAgent, ClientIp: clientIp}
	affected, err := ormManager.engine.Insert(s)
	if err != nil {
		panic(err)
	}

	return affected != 0
}

func StartSession(id string, websiteId string, userAgent string, clientIp string) {
	if !HasSession(id, websiteId) {
		AddSession(id, websiteId, userAgent, clientIp)
	}
}

func DeleteSession(id string, websiteId string) bool {
	affected, err := ormManager.engine.Id(core.PK{id, websiteId}).Delete(&Session{})
	if err != nil {
		panic(err)
	}

	return affected != 0
}

func NewSession(id string) *Session {
	ss := Session{}
	ss.Id = id
	ss.Traces = []*Trace{}

	ss.TraceMap = map[string]*Trace{}
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
