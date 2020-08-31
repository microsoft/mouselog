// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package detect

import "github.com/microsoft/mouselog/object"

func initEvents(events []*object.Event) {
	for i := 1; i < len(events); i++ {
		if events[i].Timestamp <= events[i-1].Timestamp {
			events[i].Timestamp = events[i-1].Timestamp + 0.0001
		}
	}

	for i := 1; i < len(events); i++ {
		events[i].Speed = getSpeed(events[i-1], events[i])
	}

	for i := 1; i < len(events); i++ {
		events[i].Acceleration = int(float64(events[i].Speed-events[i-1].Speed) / (events[i].Timestamp - events[i-1].Timestamp))
	}
}
