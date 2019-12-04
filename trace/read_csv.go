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
	RowEventTypeList
	RowButtonList
	RowPointerTypeList
	RowXList
	RowYList
)

func getUnifiedPointerType(pointerTypeList []string) string {
	resList := []string{}
	resMap := map[string]int{}
	for _, pt := range pointerTypeList {
		if _, ok := resMap[pt]; !ok {
			resMap[pt] = 1
			resList = append(resList, pt)
		}
	}

	return strings.Join(resList, ", ")
}

func readCsvLine(ss *Session, line string, i int) {
	row := strings.SplitN(line, ",", RowYList+1)

	t := newTrace(strconv.Itoa(i))
	t.RequestId = row[RowRequestId]
	t.Timestamp = row[RowTimestamp]
	t.Url = row[RowUrl]
	t.UserAgent = row[RowUserAgent]
	t.ClientIp = row[RowClientIp]

	isBot := row[RowIsBot]
	if isBot == "True" {
		t.IsBot = 1
	} else {
		t.IsBot = 0
	}

	timestampList := strings.Split(row[RowTimestampList], "|")
	eventTypeList := strings.Split(row[RowEventTypeList], "|")
	buttonList := strings.Split(row[RowButtonList], "|")
	pointerTypeList := strings.Split(row[RowPointerTypeList], "|")
	t.PointerType = getUnifiedPointerType(pointerTypeList)
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
		if eventTypeList[i] == "Move" {
			typ = EventTypeMouseMove
		} else if eventTypeList[i] == "Click" {
			if buttonList[i] == "Left" {
				typ = EventTypeClick
			} else if buttonList[i] == "Right" {
				typ = EventTypeContextMenu
			} else {
				panic(errors.New("unknown button: " + buttonList[i]))
			}
		} else if eventTypeList[i] == "Down" {
			if buttonList[i] == "Left" {
				typ = EventTypeClick
			} else if buttonList[i] == "Right" {
				typ = EventTypeContextMenu
			} else {
				continue
				//panic(errors.New("unknown button: " + buttonList[i]))
			}
		} else if eventTypeList[i] == "Up" {
			continue
		} else {
			panic(errors.New("unknown event type: " + eventTypeList[i]))
		}

		t.addEvent(timestamp, typ, x, y, pointerTypeList[i])
	}

	t.sortEvents()
	normalizeWidthAndHeight(t, maxX, minX, maxY, minY)

	ss.AddTrace(t)

	if i%1000 == 0 {
		fmt.Printf("[%d] Read trace a line\n", i)
	}
}

