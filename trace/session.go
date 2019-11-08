package trace

type Session struct {
	Id string `json:"sessionId"`

	UrlMap map[string]*Events `json:"-"`
}

type Result struct {
	IsBot int    `json:"isBot"`
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

func (ss *Session) AddEvents(events *Events) {
	url := events.Url
	if es, ok := ss.UrlMap[url]; !ok {
		ss.UrlMap[url] = events
	} else {
		es.Data = append(es.Data, events.Data...)
	}
}

func (ss *Session) GetDetectResult(url string) *Result {
	es, ok := ss.UrlMap[url]
	res := Result{}
	res.UrlRows = []UrlRow{}

	for _, events := range ss.UrlMap {
		res.UrlRows = append(res.UrlRows, UrlRow{
			Url:   events.Url,
			Count: len(events.Data),
		})
	}

	if url == "" || !ok {
		res.IsBot = -1
	} else {
		res.IsBot, res.Rule = es.Detect()
	}

	return &res
}
