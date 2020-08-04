// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package detect

import (
	"fmt"
	"math"

	"github.com/microsoft/mouselog/trace"
)

func checkStraightLine(t *trace.Trace) (int, string, int, int, int) {
	boxLen := 10
	lineLimit := 30
	distLimit := 400

	degrees := []float64{}
	for i := 0; i < len(t.Events)-boxLen*2; i++ {
		x1 := t.Events[i+boxLen].X - t.Events[i].X
		y1 := t.Events[i+boxLen].Y - t.Events[i].Y
		x2 := t.Events[i+2*boxLen].X - t.Events[i+boxLen].X
		y2 := t.Events[i+2*boxLen].Y - t.Events[i+boxLen].Y
		degree := getDegree(x1, y1, x2, y2)

		degrees = append(degrees, degree)
	}

	l := 0
	for i := 0; i < len(degrees)-1; i++ {
		if math.Abs(degrees[i]-degrees[i+1]) < math.Pi/72 {
			l += 1
			if l >= lineLimit && isDistanceLargerThan(t.Events[i -l].X, t.Events[i -l].Y, t.Events[i].X, t.Events[i].Y, distLimit) {
				return 1, fmt.Sprintf("straight line found in %d+ continuous points and %d+ pixel distances, range = (%d, %d)", lineLimit, distLimit, i -l, i), RuleStraightLine, i - l, i
			}
		} else {
			l = 0
		}
	}

	return 0, ReasonNone, RuleNone, -1, -1
}
