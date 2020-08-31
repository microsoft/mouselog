// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package detect

import (
	"fmt"

	"github.com/microsoft/mouselog/object"
)

var AccelerationLimit = 2

func getNegativeValue(i int) int {
	if i >= 0 {
		return 0
	} else {
		return 1
	}
}

func checkAcceleration(events []*object.Event) (int, string, int, int, int) {
	for i := 5; i < len(events); i++ {
		if events[i].Type != "mousedown" {
			continue
		}

		accSum := 0
		invalid := false
		for j := -5; j < 0; j++ {
			if events[i+j].Type != "mousemove" {
				invalid = true
				break
			}
			accSum += getNegativeValue(events[i+j].Acceleration)
		}

		if !invalid && accSum < AccelerationLimit {
			return 1, fmt.Sprintf("acceleration count %d < %d in 5 events before click, range = (%d, %d)", accSum, AccelerationLimit, i-5, i), RuleAccelerationBeforeClick, i - 5, i
		}
	}

	return 0, ReasonNone, RuleNone, -1, -1
}
