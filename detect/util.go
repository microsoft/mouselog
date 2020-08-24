// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package detect

import (
	"math"

	"github.com/microsoft/mouselog/trace"
)

func getSpeed(e1 *trace.Event, e2 *trace.Event) int {
	return int(getDistanceRaw(e1.X, e1.Y, e2.X, e2.Y) / (e2.Timestamp - e1.Timestamp))
}

func getDistance(e1 *trace.Event, e2 *trace.Event) float64 {
	return getDistanceRaw(e1.X, e1.Y, e2.X, e2.Y)
}

func getDistanceRaw(x1 int, y1 int, x2 int, y2 int) float64 {
	return math.Sqrt(float64((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2)))
}

func getDegree(x1 int, y1 int, x2 int, y2 int) float64 {
	cos := float64(x1*x2+y1*y2) / math.Sqrt(float64(x1*x1+y1*y1)) / math.Sqrt(float64(x2*x2+y2*y2))
	degree := math.Acos(cos)
	return degree
}

func isDistanceLargerThan(x1 int, y1 int, x2 int, y2 int, dist int) bool {
	return (x1-x2)*(x1-x2)+(y1-y2)*(y1-y2) > dist*dist
}

func isLineDistanceSumSmallerThan(events []*trace.Event, start int, end int, dist int) (bool, int) {
	sum := 0

	x1, y1 := events[start].X, events[start].Y
	x2, y2 := events[end].X, events[end].Y
	// https://blog.csdn.net/madbunny/article/details/43955883
	a := y2 - y1
	b := x1 - x2
	c := x2*y1 - x1*y2
	denominator := math.Sqrt(float64(a*a + b*b))

	for i := start + 1; i < end; i++ {
		x, y := events[i].X, events[i].Y
		sum += int(math.Abs(float64(a*x+b*y+c)) / denominator)
	}

	return sum < dist, sum
}

func getStandardDeviationForSpeed(events []*trace.Event) int {
	moveEvents := []*trace.Event{}
	for _, event := range events {
		if event.Type == "mousemove" || event.Type == "touchmove" {
			moveEvents = append(moveEvents, event)
		}
	}

	if len(moveEvents) > 2 {
		moveEvents = moveEvents[1:len(moveEvents)-1]
	}

	mean := 0
	for _, event := range moveEvents {
		mean += event.Speed
	}
	mean /= len(moveEvents)

	sd := 0
	for _, event := range moveEvents {
		sd += (event.Speed - mean) * (event.Speed - mean)
	}
	sd = int(math.Sqrt(float64(sd / len(moveEvents))))
	return sd
}
