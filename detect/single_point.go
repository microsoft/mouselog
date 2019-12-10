package detect

import "github.com/mouselog/mouselog/trace"

func checkSingleEvent(t *trace.Trace) (int, string, int, int, int) {
	if len(t.Events) == 1 {
		return 1, "only one event found", RuleSingleEvent, -1, -1
	}

	return 0, "", RuleNone, -1, -1
}
