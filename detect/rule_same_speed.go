// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package detect

import (
	"fmt"

	"github.com/microsoft/mouselog/trace"
)

var SameSpeedEventLimit = 50
var SameSpeedSdLimit = 1000

func checkSameSpeed(events []*trace.Event) (int, string, int, int, int) {
	if len(events) <= SameSpeedEventLimit {
		return 0, ReasonNone, RuleNone, -1, -1
	}

	sd := getStandardDeviationForSpeed(events)

	if sd < SameSpeedSdLimit {
		return 1, fmt.Sprintf("pointer speed standard deviation too small (%d < %d pixels/s) for more than %d events", sd, SameSpeedSdLimit, SameSpeedEventLimit), RuleSameSpeed, -1, -1
	} else {
		return 0, ReasonNone, RuleNone, -1, -1
	}
}
