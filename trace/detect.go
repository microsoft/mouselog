package trace

import (
	"fmt"
	"math"
)

func getDegree(x1 int, y1 int, x2 int, y2 int) float64 {
	cos := float64(x1*x2+y1*y2) / math.Sqrt(float64(x1*x1+y1*y1)) / math.Sqrt(float64(x2*x2+y2*y2))
	degree := math.Acos(cos)
	return degree
}

func isDistanceLargerThan(x1 int, y1 int, x2 int, y2 int, dist int) bool {
	return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) > dist * dist
}

func (es *Events) Detect() (int, string, int, int) {
	//if len(es.Data) > 100 {
	//	return true, "too many points, > 100"
	//}

	m := 10
	for i := len(es.Degrees); i < len(es.Data)-m*2; i++ {
		x1 := es.Data[i+m].X - es.Data[i].X
		y1 := es.Data[i+m].Y - es.Data[i].Y
		x2 := es.Data[i+2*m].X - es.Data[i+m].X
		y2 := es.Data[i+2*m].Y - es.Data[i+m].Y
		degree := getDegree(x1, y1, x2, y2)

		es.Degrees = append(es.Degrees, degree)
	}

	lineLen := 0
	th := 30
	pixelTh := 400
	for i := 0; i < len(es.Degrees)-1; i++ {
		if math.Abs(es.Degrees[i]-es.Degrees[i+1]) < math.Pi/36 {
			lineLen += 1
			if lineLen >= th && isDistanceLargerThan(es.Data[i - lineLen].X, es.Data[i - lineLen].Y, es.Data[i].X, es.Data[i].Y, pixelTh) {
				return 1, fmt.Sprintf("straight line found in %d+ continuous points and %d+ pixel distances, range = (%d, %d)", th, pixelTh, i - lineLen, i), i - lineLen, i
			}
		} else {
			lineLen = 0
		}
	}

	return 0, "", -1, -1
}
