// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package detect

import "math"

func getDistance(x1 int, y1 int, x2 int, y2 int) float64 {
	return math.Sqrt(float64((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)))
}

func getDegree(x1 int, y1 int, x2 int, y2 int) float64 {
	cos := float64(x1*x2+y1*y2) / math.Sqrt(float64(x1*x1+y1*y1)) / math.Sqrt(float64(x2*x2+y2*y2))
	degree := math.Acos(cos)
	return degree
}

func isDistanceLargerThan(x1 int, y1 int, x2 int, y2 int, dist int) bool {
	return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) > dist * dist
}

