// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package detect

import (
	"fmt"
	"github.com/microsoft/mouselog/trace"
	"github.com/microsoft/mouselog/util"
)

func checkTimeConflict(events []*trace.Event) (int, string, int, int, int) {
	moveEvents := []*trace.Event{}
	for _, event := range events {
		if event.Type == "mousemove" || event.Type == "touchmove" {
			moveEvents = append(moveEvents, event)
		}
	}

	for i := 0; i < len(moveEvents)-1; i++ {
		if moveEvents[i].Timestamp == moveEvents[i+1].Timestamp {
			return 1, fmt.Sprintf("same timestamp: %s for two events: %d and %d", util.FormatFloat(moveEvents[i].Timestamp), i, i+1), RuleTimeConflict, i, i + 2

		}
	}

	return 0, ReasonNone, RuleNone, -1, -1
}
