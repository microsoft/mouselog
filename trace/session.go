package trace

type Session struct {
	Id string `json:"sessionId"`

	Traces []*Trace `json:"traces"`

	UrlMap map[string]*Trace `json:"-"`
}

func NewSession(id string) *Session {
	ss := Session{}
	ss.Id = id
	ss.Traces = []*Trace{}

	ss.UrlMap = map[string]*Trace{}
	return &ss
}

func (ss *Session) AddTrace(t *Trace) {
	url := t.Url
	if tOriginal, ok := ss.UrlMap[url]; !ok {
		ss.UrlMap[url] = t
		ss.Traces = append(ss.Traces, t)
	} else {
		tOriginal.Events = append(tOriginal.Events, t.Events...)
	}
}

func (ss *Session) ToJson() *SessionJson {
	sj := SessionJson{
		Id:        ss.Id,
		TraceSize: len(ss.Traces),
	}
	return &sj
}
