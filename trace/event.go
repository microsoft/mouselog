package trace

type Event struct {
	Timestamp float64 `json:"timestamp"`
	X         int     `json:"x"`
	Y         int     `json:"y"`
}
