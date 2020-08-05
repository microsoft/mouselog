// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package detect

import (
	"fmt"

	"github.com/microsoft/mouselog/trace"
)

func checkNearStraightLine(t *trace.Trace) (int, string, int, int, int) {
	lineLimit := 20
	distLimit := 0

	targetLen := 0
	for i := 0; i < len(t.Events)-1; i++ {
		if t.Events[i+1].Timestamp-t.Events[i].Timestamp < 0.1 {
			targetLen += 1
			if targetLen >= lineLimit && isLineDistanceSumLargerThan(t, i-targetLen, i, distLimit) {
				return 1, fmt.Sprintf("near straight line found in %d+ continuous points and %d+ pixel distances, range = (%d, %d)", lineLimit, distLimit, i-targetLen, i), RuleNearStraightLine, i - targetLen, i
			}
		} else {
			targetLen = 0
		}
	}

	return 0, ReasonNone, RuleNone, -1, -1
}
