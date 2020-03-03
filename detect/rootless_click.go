// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package detect

import "github.com/microsoft/mouselog/trace"

// https://developer.mozilla.org/en-US/docs/Web/Events
const EventTypeClick = "click"

func checkRootlessClick(t *trace.Trace) (int, string, int, int, int) {
	for i := 0; i < len(t.Events); i++ {
		if t.Events[i].Type == EventTypeClick {
			if i == 0 || (t.Events[i-1].X != t.Events[i].X || t.Events[i-1].Y != t.Events[i].Y) {
				return 1, "rootless click found", RuleRootlessClick, i, -1
			}
		}
	}

	return 0, ReasonNone, RuleNone, -1, -1
}
