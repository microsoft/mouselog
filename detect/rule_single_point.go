// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package detect

import "github.com/microsoft/mouselog/object"

func checkSinglePoint(events []*object.Event) (int, string, int, int, int) {
	if len(events) == 1 {
		return 1, "single point found", RuleSinglePoint, 0, -1
	}

	x := events[0].X
	y := events[0].Y
	for i := 1; i < len(events); i ++ {
		if events[i].X != x || events[i].Y != y {
			return 0, ReasonNone, RuleNone, -1, -1
		}
	}

	return 1, "single point found", RuleSinglePoint, 1, -1
}
