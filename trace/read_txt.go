package trace

import (
	"fmt"
	"math"
	"strings"

	"github.com/mouselog/mouselog/util"
)

const (
	RowNo = iota
	RowTrace
	RowTarget
	RowLabel
)

func readTxtLine(ss *Session, line string, i int) {
	row := strings.SplitN(line, " ", RowLabel+1)

	no := row[RowNo]
	trace := row[RowTrace]
	//target := row[RowTarget]

	t := newTrace(no)

	if len(row) == RowLabel+1 {
		label := row[RowLabel]
		if label == "0" {
			t.IsBot = 1
		} else {
			t.IsBot = 0
		}
	}
	points := strings.Split(trace, ";")
	minX := math.MaxInt32
	minY := math.MaxInt32
	maxX := 0
	maxY := 0
	for _, point := range points {
		if point == "" {
			continue
		}

		tokens := strings.Split(point, ",")
		x := util.ParseInt(tokens[0])
		if maxX < x {
			maxX = x
		}
		if minX > x {
			minX = x
		}
		y := util.ParseInt(tokens[1])
		if maxY < y {
			maxY = y
		}
		if minY > y {
			minY = y
		}
		timestamp := util.ParseFloat(tokens[2])

		t.addEvent(timestamp, EventTypeMouseMove, ButtonLeft, x, y)
	}

	normalizeWidthAndHeight(t, maxX, minX, maxY, minY)

	ss.AddTrace(t)

	if i%1000 == 0 {
		fmt.Printf("[%d] Read trace a line\n", i)
	}
}

