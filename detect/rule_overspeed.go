// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package detect

import (
	"fmt"

	"github.com/microsoft/mouselog/trace"
)

var SpeedLimit = 1000.0

func checkOverspeed(events []*trace.Event) (int, string, int, int, int) {
	dist := 0.0
	for i := 0; i < len(events) - 1; i ++ {
		dist += getDistance(events[i].X, events[i].Y, events[i+1].X, events[i+1].Y)
	}

	time := events[len(events) - 1].Timestamp - events[0].Timestamp

	speed := dist / time

	if time > 20 && speed > SpeedLimit {
		return 1, fmt.Sprintf("pointer speed too fast (%d > %d pixels/s) in more than 20 seconds", int(speed), int(SpeedLimit)), RuleOverspeed, -1, -1
	} else {
		return 0, ReasonNone, RuleNone, -1, -1
	}
}
