package trace

import "sort"

type Trace struct {
	Id           string `json:"id"`
	Width        int    `json:"width"`
	Height       int    `json:"height"`
	PageLoadTime string `json:"pageLoadTime"`

	Label     int    `json:"label"`
	Guess     int    `json:"guess"`
	Reason    string `json:"reason"`
	RuleId    int    `json:"ruleId"`
	RuleStart int    `json:"ruleStart"`
	RuleEnd   int    `json:"ruleEnd"`

	Events  []Event   `json:"events"`
	Degrees []float64 `json:"-"`

	RequestId   string `json:"requestId"`
	Timestamp   string `json:"timestamp"`
	Url         string `json:"url"`
	UserAgent   string `json:"userAgent"`
	ClientIp    string `json:"clientIp"`
	PointerType string `json:"pointerType"`
}

func newTrace(id string) *Trace {
	t := Trace{}
	t.Id = id
	t.Label = -1
	t.Guess = -1
	t.RuleStart = -1
	t.RuleEnd = -1
	t.Events = []Event{}
	return &t
}

func (t *Trace) addEvent(timestamp float64, typ string, button string, x int, y int) {
	e := Event{
		Id:        len(t.Events),
		Timestamp: timestamp,
		Type:      typ,
		Button:    button,
		X:         x,
		Y:         y,
	}

	t.Events = append(t.Events, e)
}

func (t *Trace) sortEvents() {
	sort.Slice(t.Events, func(i, j int) bool {
		return t.Events[i].Timestamp < t.Events[j].Timestamp
	})
}
