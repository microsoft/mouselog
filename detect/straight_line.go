// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package detect

import (
	"fmt"
	"math"

	"github.com/microsoft/mouselog/trace"
)

func checkStraightLine(t *trace.Trace) (int, string, int, int, int) {
	m := 10
	for i := len(t.Degrees); i < len(t.Events)-m*2; i++ {
		x1 := t.Events[i+m].X - t.Events[i].X
		y1 := t.Events[i+m].Y - t.Events[i].Y
		x2 := t.Events[i+2*m].X - t.Events[i+m].X
		y2 := t.Events[i+2*m].Y - t.Events[i+m].Y
		degree := getDegree(x1, y1, x2, y2)

		t.Degrees = append(t.Degrees, degree)
	}

	lineLen := 0
	th := 30
	pixelTh := 400
	for i := 0; i < len(t.Degrees)-1; i++ {
		if math.Abs(t.Degrees[i]-t.Degrees[i+1]) < math.Pi/72 {
			lineLen += 1
			if lineLen >= th && isDistanceLargerThan(t.Events[i - lineLen].X, t.Events[i - lineLen].Y, t.Events[i].X, t.Events[i].Y, pixelTh) {
				return 1, fmt.Sprintf("straight line found in %d+ continuous points and %d+ pixel distances, range = (%d, %d)", th, pixelTh, i - lineLen, i), RuleStraightLine, i - lineLen, i
			}
		} else {
			lineLen = 0
		}
	}

	return 0, ReasonNone, RuleNone, -1, -1
}
