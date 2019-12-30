package detect

import "github.com/microsoft/mouselog/trace"

func checkRootlessClick(t *trace.Trace) (int, string, int, int, int) {
	for i := 0; i < len(t.Events); i ++ {
		if t.Events[i].Type == trace.EventTypeClick {
			if i == 0 || (t.Events[i - 1].X != t.Events[i].X || t.Events[i - 1].Y != t.Events[i].Y) {
				return 1, "rootless click found", RuleRootlessClick, i, -1
			}
		}
	}

	return 0, ReasonNone, RuleNone, -1, -1
}
