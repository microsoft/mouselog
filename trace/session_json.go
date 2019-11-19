package trace

type SessionJson struct {
	Id string `json:"sessionId"`

	IsBot     int    `json:"isBot"`
	Rule      string `json:"rule"`
	RuleStart int    `json:"ruleStart"`
	RuleEnd   int    `json:"ruleEnd"`
	TraceSize int    `json:"traceSize"`
}
