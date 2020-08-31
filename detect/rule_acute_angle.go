// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package detect

import (
	"fmt"
	"math"

	"github.com/microsoft/mouselog/object"
)

var AcuteAngleLimit = 3

func checkAcuteAngle(events []*object.Event) (int, string, int, int, int) {
	if len(events) < 3 {
		return 0, ReasonNone, RuleNone, -1, -1
	}

	acuteAngleCount := 0
	for i := 2; i < len(events); i ++ {
		l1 := getDistance(events[i], events[i-1])
		l2 := getDistance(events[i-2], events[i-1])
		if l1 <= 100 || l2 <= 100 {
			continue
		}

		radianDiff := getRadian(
			events[i].X - events[i-1].X,
			events[i].Y - events[i-1].Y,
			events[i-2].X - events[i-1].X,
			events[i-2].Y - events[i-1].Y,
			)
		radianDiff = math.Abs(radianDiff)

		if radianDiff < 0.087 {
			acuteAngleCount += 1
		}
	}

	if acuteAngleCount > AcuteAngleLimit {
		return 1, fmt.Sprintf("acute angles too many (%d > %d)", acuteAngleCount, AcuteAngleLimit), RuleAcuteAngle, -1, -1
	} else {
		return 0, ReasonNone, RuleNone, -1, -1
	}
}
