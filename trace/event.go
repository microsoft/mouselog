package trace

type Events struct {
	Url    string `json:"url"`
	Width  int    `json:"width"`
	Height int    `json:"height"`

	Data    []Event   `json:"events"`
	Degrees []float64 `json:"-"`
}

type Event struct {
	Timestamp float64 `json:"timestamp"`
	X         int     `json:"x"`
	Y         int     `json:"y"`
}

func newEvents(url string) *Events {
	es := Events{}
	es.Url = url
	es.Data = []Event{}
	return &es
}

func (es *Events) addEvent(t float64, x int, y int) {
	e := Event{
		Timestamp: t,
		X:         x,
		Y:         y,
	}

	es.Data = append(es.Data, e)
}
