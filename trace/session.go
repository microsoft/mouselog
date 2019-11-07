package trace

type Session struct {
	Id string `json:"sessionId"`

	UrlMap map[string]*Events `json:"-"`
}

type Result struct {
	IsBot bool   `json:"isBot"`
	Rule  string `json:"rule"`

	UrlRows []UrlRow `json:"urlRows"`
}

type UrlRow struct {
	Url   string `json:"url"`
	Count int    `json:"count"`
}

func NewSession(id string) *Session {
	ss := Session{}
	ss.Id = id
	ss.UrlMap = map[string]*Events{}
	return &ss
}

func (ss *Session) AddEventsAndDetect(events *Events) *Result {
	url := events.Url
	if es, ok := ss.UrlMap[url]; !ok {
		ss.UrlMap[url] = events
		es = events
		return ss.GetResult(es)
	} else {
		es.Data = append(es.Data, events.Data...)
		return ss.GetResult(es)
	}
}

func (ss *Session) GetResult(es *Events) *Result {
	res := Result{}
	res.IsBot, res.Rule = es.Detect()

	for _, events := range ss.UrlMap {
		res.UrlRows = append(res.UrlRows, UrlRow{
			Url:   events.Url,
			Count: len(events.Data),
		})
	}
	return &res
}
