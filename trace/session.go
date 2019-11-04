package trace

import "strings"

type Session struct {
	Id string `json:"sessionId"`

	UrlMap map[string]*Events `json:"-"`
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

func (s *Session) ToString() string {
	tokens := []string{}
	for _, events := range s.UrlMap {
		tokens = append(tokens, events.ToString())
	}
	return strings.Join(tokens, ", ")
}
