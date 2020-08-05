// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package detect

import "github.com/microsoft/mouselog/trace"

func checkSinglePoint(events []*trace.Event) (int, string, int, int, int) {
	if len(events) == 1 {
		return 1, "only one point found", RuleSinglePoint, 0, len(events)
	}

	x := events[0].X
	y := events[0].Y
	for i := 1; i < len(events); i ++ {
		if events[i].X != x || events[i].Y != y {
			return 0, ReasonNone, RuleNone, -1, -1
		}
	}

	return 1, "only one point found", RuleSinglePoint, 0, len(events)
}
