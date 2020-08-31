// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package detect

import (
	"math"

	"github.com/microsoft/mouselog/object"
)

func getSpeed(e1 *object.Event, e2 *object.Event) int {
	return int(getDistanceRaw(e1.X, e1.Y, e2.X, e2.Y) / (e2.Timestamp - e1.Timestamp))
}

func getDistance(e1 *object.Event, e2 *object.Event) float64 {
	return getDistanceRaw(e1.X, e1.Y, e2.X, e2.Y)
}

func getDistanceRaw(x1 int, y1 int, x2 int, y2 int) float64 {
	return math.Sqrt(float64((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2)))
}

func getDistanceFromOrigin(x int, y int) float64 {
	return math.Sqrt(float64(x*x + y*y))
}

func getRadian(x1 int, y1 int, x2 int, y2 int) float64 {
	cos := float64(x1*x2+y1*y2) / getDistanceFromOrigin(x1, y1) / getDistanceFromOrigin(x2, y2)
	radian := math.Acos(cos)
	return radian
}

func isDistanceLargerThan(x1 int, y1 int, x2 int, y2 int, dist int) bool {
	return (x1-x2)*(x1-x2)+(y1-y2)*(y1-y2) > dist*dist
}

func isLineDistanceSumSmallerThan(events []*object.Event, start int, end int, dist int) (bool, int) {
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

func getStandardDeviationForSpeed(events []*object.Event) int {
	moveEvents := []*object.Event{}
	for _, event := range events {
		if event.Type == "mousemove" || event.Type == "touchmove" {
			moveEvents = append(moveEvents, event)
		}
	}

	if len(moveEvents) > 2 {
		moveEvents = moveEvents[1 : len(moveEvents)-1]
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
