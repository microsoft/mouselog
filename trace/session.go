package trace

type Session struct {
	Id string `json:"sessionId"`

	IsBot int       `json:"isBot"`
	Rule  string    `json:"rule"`
	Data  []*Events `json:"data"`

	UrlMap map[string]*Events `json:"-"`
}

func NewSession(id string) *Session {
	ss := Session{}
	ss.Id = id
	ss.IsBot = -1
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
		ss.IsBot, ss.Rule = es.Detect()
	}

	return ss
}
