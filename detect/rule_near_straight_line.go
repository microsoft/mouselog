// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package detect

import (
	"fmt"

	"github.com/microsoft/mouselog/trace"
)

func checkNearStraightLine(events []*trace.Event) (int, string, int, int, int) {
	timeStep := 1.0
	lineLimit := 30
	distLimit := 200

	targetLen := 0
	for i := 0; i < len(events)-1; i++ {
		if events[i+1].Timestamp-events[i].Timestamp < timeStep {
			targetLen += 1
			if targetLen >= lineLimit {
				isBot, dist := isLineDistanceSumSmallerThan(events, i-targetLen+1, i, distLimit)
				if isBot {
					return 1, fmt.Sprintf("near straight line found in %d+ continuous points and < %d (%d) pixel distances, range = (%d, %d)", lineLimit, distLimit, dist, i-targetLen+1, i), RuleNearStraightLine, i - targetLen + 1, i
				}
			}
		} else {
			targetLen = 0
		}
	}

	return 0, ReasonNone, RuleNone, -1, -1
}
