package trace

type Session struct {
	Id string `json:"sessionId"`

	IsBot     int       `json:"isBot"`
	Rule      string    `json:"rule"`
	RuleStart int       `json:"ruleStart"`
	RuleEnd   int       `json:"ruleEnd"`
	Data      []*Events `json:"data"`

	UrlMap map[string]*Events `json:"-"`
}

func NewSession(id string) *Session {
	ss := Session{}
	ss.Id = id
	ss.IsBot = -1
	ss.RuleStart = -1
	ss.RuleEnd = -1
	ss.Data = []*Events{}

	ss.UrlMap = map[string]*Events{}
	return &ss
}

func (ss *Session) AddEvents(events *Events) {
	url := events.Url
	if es, ok := ss.UrlMap[url]; !ok {
		ss.UrlMap[url] = events
		ss.Data = append(ss.Data, events)
	} else {
		es.Data = append(es.Data, events.Data...)
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
		DataLen: len(ss.Data),
	}
	return &sj
}
