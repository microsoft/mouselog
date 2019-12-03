package trace

import (
	"errors"
	"fmt"
	"math"
	"strconv"
	"strings"

	"github.com/mouselog/mouselog/util"
)

const (
	RowRequestId = iota
	RowTimestamp
	RowUrl
	RowUserAgent
	RowClientIp
	RowIsBot
	RowPointCount
	RowTimestampList
	RowTypeList
	RowXList
	RowYList
)

func readCsvLine(ss *Session, line string, i int) {
	row := strings.SplitN(line, ",", RowYList+1)

	t := newTrace(strconv.Itoa(i))
	t.RequestId = row[RowRequestId]
	t.Timestamp = row[RowTimestamp]
	t.Url = row[RowUrl]
	t.UserAgent = row[RowUserAgent]
	t.ClientIp = row[RowClientIp]

	isBot := row[RowIsBot]
	if isBot == "TRUE" {
		t.IsBot = 1
	} else {
		t.IsBot = 0
	}

	timestampList := strings.Split(row[RowTimestampList], "|")
	typeList := strings.Split(row[RowTypeList], "|")
	xList := strings.Split(row[RowXList], "|")
	yList := strings.Split(row[RowYList], "|")
	minX := math.MaxInt32
	minY := math.MaxInt32
	maxX := 0
	maxY := 0
	for i := 0; i < len(timestampList); i ++ {
		x := util.ParseInt(xList[i])
		if maxX < x {
			maxX = x
		}
		if minX > x {
			minX = x
		}
		y := util.ParseInt(yList[i])
		if maxY < y {
			maxY = y
		}
		if minY > y {
			minY = y
		}
		timestamp := util.ParseFloat(timestampList[i])
		var typ string
		if typeList[i] == "Move" {
			typ = TypeMouseMove
		} else if typeList[i] == "Click" {
			typ = TypeClick
		} else if typeList[i] == "Down" {
			typ = TypeClick
		} else if typeList[i] == "Up" {
			continue
		} else {
			panic(errors.New("unknown event type: " + typeList[i]))
		}

		t.addEvent(timestamp, typ, x, y, true)
	}

	normalizeWidthAndHeight(t, maxX, minX, maxY, minY)

	ss.AddTrace(t)

	if i%1000 == 0 {
		fmt.Printf("[%d] Read trace a line\n", i)
	}
}

