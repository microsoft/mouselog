package trace

type Session struct {
	Id string `json:"sessionId"`

	IsBot     int      `json:"isBot"`
	Rule      string   `json:"rule"`
	RuleStart int      `json:"ruleStart"`
	RuleEnd   int      `json:"ruleEnd"`
	Traces    []*Trace `json:"traces"`

	UrlMap map[string]*Trace `json:"-"`
}

func NewSession(id string) *Session {
	ss := Session{}
	ss.Id = id
	ss.IsBot = -1
	ss.RuleStart = -1
	ss.RuleEnd = -1
	ss.Traces = []*Trace{}

	ss.UrlMap = map[string]*Trace{}
	return &ss
}

func (ss *Session) AddTrace(t *Trace) {
	url := t.Url
	if es, ok := ss.UrlMap[url]; !ok {
		ss.UrlMap[url] = t
		ss.Traces = append(ss.Traces, t)
	} else {
		es.Data = append(es.Data, t.Data...)
	}
}

func (ss *Session) GetDetectResult(url string) *Session {
	es, ok := ss.UrlMap[url]
	if url == "" || !ok {
		ss.IsBot = -1
	} else {
		ss.IsBot, ss.Rule, ss.RuleStart, ss.RuleEnd = es.Detect()
	}

	return ss
}

func (ss *Session) ToJson() *SessionJson {
	sj := SessionJson{
		Id:        ss.Id,
		IsBot:     ss.IsBot,
		Rule:      ss.Rule,
		RuleStart: ss.RuleStart,
		RuleEnd:   ss.RuleEnd,
		TraceSize: len(ss.Traces),
	}
	return &sj
}
