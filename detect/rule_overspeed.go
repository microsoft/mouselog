// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package detect

import (
	"fmt"

	"github.com/microsoft/mouselog/object"
)

var EventLimit = 50
var SpeedLimit = 1000.0

func checkOverspeed(events []*object.Event) (int, string, int, int, int) {
	if len(events) <= EventLimit {
		return 0, ReasonNone, RuleNone, -1, -1
	}

	dist := 0.0
	for i := 0; i < len(events) - 1; i ++ {
		dist += getDistance(events[i], events[i+1])
	}
	time := events[len(events) - 1].Timestamp - events[0].Timestamp
	speed := dist / time

	if speed > SpeedLimit {
		return 1, fmt.Sprintf("pointer speed too fast (%d > %d pixels/s) for more than %d events", int(speed), int(SpeedLimit), EventLimit), RuleOverspeed, -1, -1
	} else {
		return 0, ReasonNone, RuleNone, -1, -1
	}
}
