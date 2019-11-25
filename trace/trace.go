package trace

type Trace struct {
	Url    string `json:"url"`
	Width  int    `json:"width"`
	Height int    `json:"height"`
	IsBot  int    `json:"isBot"`

	Events  []Event   `json:"events"`
	Degrees []float64 `json:"-"`
}

func newTrace(url string) *Trace {
	t := Trace{}
	t.Url = url
	t.IsBot = -1
	t.Events = []Event{}
	return &t
}

func (t *Trace) addEvent(timestamp float64, typ string, x int, y int, isTrusted bool) {
	e := Event{
		Timestamp: timestamp,
		Type:      typ,
		X:         x,
		Y:         y,
		IsTrusted: isTrusted,
	}

	t.Events = append(t.Events, e)
}
