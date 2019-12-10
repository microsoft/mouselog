package trace

type Session struct {
	Id string `json:"sessionId"`

	Traces   []*Trace          `json:"traces"`
	TraceMap map[string]*Trace `json:"-"`

	TN int `json:"tn"`
	FP int `json:"fp"`
	FN int `json:"fn"`
	TP int `json:"tp"`
	UN int `json:"un"`
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
	sj := SessionJson{
		Id:        ss.Id,
		TraceSize: len(ss.Traces),
		TN:        ss.TN,
		FP:        ss.FP,
		FN:        ss.FN,
		TP:        ss.TP,
		UN:        ss.UN,
	}
	return &sj
}
