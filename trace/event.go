package trace

type Event struct {
	Timestamp float64 `json:"timestamp"`
	Type      string  `json:"type"`
	Button    string  `json:"button"`
	X         int     `json:"x"`
	Y         int     `json:"y"`
	IsTrusted bool    `json:"isTrusted"`
}
