// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package detect

import "github.com/microsoft/mouselog/trace"

func initEvents(events []*trace.Event) {
	for i := 1; i < len(events); i++ {
		if events[i].Timestamp <= events[i-1].Timestamp {
			events[i].Timestamp = events[i-1].Timestamp + 0.0001
		}
	}

	for i := 0; i < len(events)-1; i++ {
		events[i].Speed = getSpeed(events[i], events[i+1])
	}

	for i := 1; i < len(events)-1; i++ {
		events[i].Acceleration = int(float64(events[i].Speed-events[i-1].Speed) / (events[i].Timestamp - events[i-1].Timestamp))
	}
}
