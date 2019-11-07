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

func (es *Events) Detect() (bool, string) {
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
	for i := 0; i < len(es.Degrees)-1; i ++ {
		if math.Abs(es.Degrees[i] - es.Degrees[i+1]) < math.Pi/18 {
			lineLen += 1
			if lineLen >= 30 {
				return true, fmt.Sprintf("straight line found in %d continuous points", th)
			}
		} else {
			lineLen = 0
		}
	}

	return false, ""
}
