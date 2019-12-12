package detect

import (
	"math"

	"github.com/microsoft/mouselog/trace"
)

func getDistance(x1 int, y1 int, x2 int, y2 int) float64 {
	return math.Sqrt(float64((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)))
}

func getSpeed(t *trace.Trace) float64 {
	dist := 0.0

	for i := 0; i < len(t.Events) - 1; i ++ {
		dist += getDistance(t.Events[i].X, t.Events[i].Y, t.Events[i+1].X, t.Events[i+1].Y)
	}

	speed := dist / float64(len(t.Events))
	return speed
}

func checkOverspeed(t *trace.Trace) (int, string, int, int, int) {
	dist := 0.0

	for i := 0; i < len(t.Events) - 1; i ++ {
		dist += getDistance(t.Events[i].X, t.Events[i].Y, t.Events[i+1].X, t.Events[i+1].Y)
	}

	speed := dist / float64(len(t.Events))

	if speed > 100 {
		return 1, "pointer speed too fast (> 100 pixels/s)", RuleOverspeed, -1, -1
	} else {
		return 0, ReasonNone, RuleNone, -1, -1
	}
}
