package detect

import (
	"fmt"

	"github.com/microsoft/mouselog/trace"
)

func checkNegativeCursor(t *trace.Trace) (int, string, int, int, int) {
	for i := 0; i < len(t.Events); i ++ {
		if t.Events[i].X < 0 || t.Events[i].Y < 0 {
			return 1, fmt.Sprintf("negative cursor found: point [%d] = (%d, %d)", i, t.Events[i].X, t.Events[i].Y), RuleNegativeCursor, i, -1
		}
	}

	return 0, ReasonNone, RuleNone, -1, -1
}
