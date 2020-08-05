// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package detect

import (
	"math"

	"github.com/microsoft/mouselog/trace"
)

func getDistance(x1 int, y1 int, x2 int, y2 int) float64 {
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

func isLineDistanceSumLargerThan(t *trace.Trace, start int, end int, dist int) bool {
	sum := 0

	x1, y1 := t.Events[start].X, t.Events[start].Y
	x2, y2 := t.Events[end].X, t.Events[end].Y
	// https://blog.csdn.net/madbunny/article/details/43955883
	a := y2 - y1
	b := x1 - x2
	c := x2*y1 - x1*y2
	denominator := math.Sqrt(float64(a*a + b*b))

	for i := start + 1; i < end; i++ {
		x, y := t.Events[i].X, t.Events[i].Y
		sum += int(math.Abs(float64(a*x+b*y+c)) / denominator)
	}

	return sum > dist
}
