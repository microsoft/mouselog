// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package detect

import (
	"fmt"

	"github.com/microsoft/mouselog/trace"
)

var SpeedLimit = 500.0

func checkOverspeed(t *trace.Trace) (int, string, int, int, int) {
	dist := 0.0
	for i := 0; i < len(t.Events) - 1; i ++ {
		dist += getDistance(t.Events[i].X, t.Events[i].Y, t.Events[i+1].X, t.Events[i+1].Y)
	}

	time := t.Events[len(t.Events) - 1].Timestamp - t.Events[0].Timestamp

	speed := dist / time

	if time > 20 && speed > SpeedLimit {
		return 1, fmt.Sprintf("pointer speed too fast (%d > %d pixels/s) in more than 20 seconds", int(speed), int(SpeedLimit)), RuleOverspeed, -1, -1
	} else {
		return 0, ReasonNone, RuleNone, -1, -1
	}
}
