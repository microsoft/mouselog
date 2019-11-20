package trace

type Trace struct {
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

func newTrace(url string) *Trace {
	t := Trace{}
	t.Url = url
	t.Data = []Event{}
	return &t
}

func (t *Trace) addEvent(timestamp float64, x int, y int) {
	e := Event{
		Timestamp: timestamp,
		X:         x,
		Y:         y,
	}

	t.Data = append(t.Data, e)
}
