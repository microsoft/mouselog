// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package detect

import (
	"fmt"

	"github.com/microsoft/mouselog/trace"
)

//var EventLimit = 50
var DistLimit = 200.0

func checkOverDistance(events []*trace.Event) (int, string, int, int, int) {
	//if len(events) <= EventLimit {
	//	return 0, ReasonNone, RuleNone, -1, -1
	//}

	dists := []float64{}
	for i := 0; i < len(events) - 1; i ++ {
		dist := getDistance(events[i], events[i+1])
		if dist != 0.0 && events[i+1].Type == "mousemove" {
			dists = append(dists, dist)
		}
	}

	averageDist := 0.0
	if len(dists) > 0 {
		for _, dist := range dists {
			averageDist += dist
		}
		averageDist /= float64(len(dists))
	}

	if averageDist > DistLimit {
		return 1, fmt.Sprintf("pointer distance too long (%d > %d pixels) for more than %d events", int(averageDist), int(DistLimit), EventLimit), RuleOverDistance, -1, -1
	} else {
		return 0, ReasonNone, RuleNone, -1, -1
	}
}
