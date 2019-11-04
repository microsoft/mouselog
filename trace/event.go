package trace

import "fmt"

type Events struct {
	Url    string  `json:"url"`
	Width  int     `json:"width"`
	Height int     `json:"height"`
	Data   []Event `json:"events"`
}

type Event struct {
	Timestamp float64 `json:"timestamp"`
	X         int     `json:"x"`
	Y         int     `json:"y"`
}

func (s *Events) ToString() string {
	return fmt.Sprintf("%s: %d", s.Url, len(s.Data))
}
