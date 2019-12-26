package detect

import (
	"fmt"
	"math"

	"github.com/microsoft/mouselog/trace"
)

var SpeedLimit = 500.0

func getDistance(x1 int, y1 int, x2 int, y2 int) float64 {
	return math.Sqrt(float64((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)))
}

func checkOverspeed(t *trace.Trace) (int, string, int, int, int) {
	dist := 0.0
	for i := 0; i < len(t.Events) - 1; i ++ {
		dist += getDistance(t.Events[i].X, t.Events[i].Y, t.Events[i+1].X, t.Events[i+1].Y)
	}

	time := t.Events[len(t.Events) - 1].Timestamp - t.Events[0].Timestamp

	speed := dist / time

	if time > 20 && speed > SpeedLimit {
		return 1, fmt.Sprintf("pointer speed too fast (%d > %d pixels/s) in more than 20 seconds", int(speed), int(SpeedLimit)), RuleOverspeed, -1, -1
	} else {
		return 0, ReasonNone, RuleNone, -1, -1
	}
}
