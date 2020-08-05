// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package detect

import "github.com/microsoft/mouselog/trace"

// https://developer.mozilla.org/en-US/docs/Web/Events
const EventTypeClick = "click"

func checkRootlessClick(events []*trace.Event) (int, string, int, int, int) {
	for i := 0; i < len(events); i++ {
		if events[i].Type == EventTypeClick {
			if i == 0 || (events[i-1].X != events[i].X || events[i-1].Y != events[i].Y) {
				return 1, "rootless click found", RuleRootlessClick, i, -1
			}
		}
	}

	return 0, ReasonNone, RuleNone, -1, -1
}
