package detect

import "github.com/mouselog/mouselog/trace"

func checkSinglePoint(t *trace.Trace) (int, string, int, int, int) {
	if len(t.Events) == 1 {
		return 1, "only one point found", RuleSinglePoint, -1, -1
	}

	x := t.Events[0].X
	y := t.Events[0].Y
	for i := 1; i < len(t.Events); i ++ {
		if t.Events[i].X != x || t.Events[i].Y != y {
			return 0, "", RuleNone, -1, -1
		}
	}

	return 1, "only one point found", RuleSinglePoint, -1, -1
}
