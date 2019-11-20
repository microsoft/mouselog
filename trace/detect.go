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

func (t *Trace) Detect() (int, string, int, int) {
	m := 10
	for i := len(t.Degrees); i < len(t.Data)-m*2; i++ {
		x1 := t.Data[i+m].X - t.Data[i].X
		y1 := t.Data[i+m].Y - t.Data[i].Y
		x2 := t.Data[i+2*m].X - t.Data[i+m].X
		y2 := t.Data[i+2*m].Y - t.Data[i+m].Y
		degree := getDegree(x1, y1, x2, y2)

		t.Degrees = append(t.Degrees, degree)
	}

	lineLen := 0
	th := 30
	pixelTh := 400
	for i := 0; i < len(t.Degrees)-1; i++ {
		if math.Abs(t.Degrees[i]-t.Degrees[i+1]) < math.Pi/72 {
			lineLen += 1
			if lineLen >= th && isDistanceLargerThan(t.Data[i - lineLen].X, t.Data[i - lineLen].Y, t.Data[i].X, t.Data[i].Y, pixelTh) {
				return 1, fmt.Sprintf("straight line found in %d+ continuous points and %d+ pixel distances, range = (%d, %d)", th, pixelTh, i - lineLen, i), i - lineLen, i
			}
		} else {
			lineLen = 0
		}
	}

	return 0, "", -1, -1
}
