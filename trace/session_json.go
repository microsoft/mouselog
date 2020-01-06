package trace

type SessionJson struct {
	Id string `json:"sessionId"`

	TraceSize int `json:"traceSize"`

	TN int `json:"tn"`
	FP int `json:"fp"`
	FN int `json:"fn"`
	TP int `json:"tp"`
	UN int `json:"un"`

	RuleCounts []int `json:"ruleCounts"`
}
