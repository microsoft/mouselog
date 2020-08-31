// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package detect

import (
	"fmt"
	"math"

	"github.com/microsoft/mouselog/object"
)

func checkStraightLine(events []*object.Event) (int, string, int, int, int) {
	boxLen := 10
	lineLimit := 30
	distLimit := 400

	radians := []float64{}
	for i := 0; i < len(events)-boxLen*2; i++ {
		x1 := events[i+boxLen].X - events[i].X
		y1 := events[i+boxLen].Y - events[i].Y
		x2 := events[i+2*boxLen].X - events[i+boxLen].X
		y2 := events[i+2*boxLen].Y - events[i+boxLen].Y
		radian := getRadian(x1, y1, x2, y2)

		radians = append(radians, radian)
	}

	targetLen := 0
	for i := 0; i < len(radians)-1; i++ {
		if math.Abs(radians[i]-radians[i+1]) < math.Pi/144 {
			if targetLen >= lineLimit && isDistanceLargerThan(events[i-targetLen].X, events[i-targetLen].Y, events[i].X, events[i].Y, distLimit) {
				return 1, fmt.Sprintf("straight line found in %d+ continuous points and %d+ pixel distances, range = (%d, %d)", lineLimit, distLimit, i-targetLen, i), RuleStraightLine, i - targetLen, i
			}
			targetLen += 1
		} else {
			targetLen = 0
		}
	}

	return 0, ReasonNone, RuleNone, -1, -1
}
