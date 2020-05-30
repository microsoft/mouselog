// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package batch

import (
	"errors"
	"fmt"
	"math"
	"strings"

	"github.com/microsoft/mouselog/trace"
	"github.com/microsoft/mouselog/util"
)

const (
	RowSessionId = iota
	RowImpressionId
	RowVertical
	RowTimestamp
	RowPageName
	RowClientIp
	RowUserAgent
	RowIsBot
	RowPageClickCount
	RowDwellTime
	RowUrl
	RowTimestampList
	RowEventTypeList
	RowButtonList
	RowPointerTypeList
	RowXList
	RowYList
)

const (
	CsvPointerTypeMouse = "Mouse"
	CsvPointerTypeTouch = "Touch"
	CsvPointerTypePen   = "Pen"
)

const (
	CsvEventTypeMove  = "Move"
	CsvEventTypeClick = "Click"
	CsvEventTypeDown  = "Down"
	CsvEventTypeUp    = "Up"
)

const (
	CsvButtonNone    = "None"
	CsvButtonLeft    = "Left"
	CsvButtonRight   = "Right"
	CsvButtonX1      = "X1"
	CsvButtonX2      = "X2"
	CsvButtonUnknown = "Unknown"
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

func addEventsToTrace(t *trace.Trace, timestampList []string, eventTypeList []string, buttonList []string, pointerTypeList []string, xList []string, yList []string) {
	minX := math.MaxInt32
	minY := math.MaxInt32
	maxX := 0
	maxY := 0
	for i := 0; i < len(timestampList); i++ {
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

		var eventType string
		var button string
		switch pointerTypeList[i] {
		case CsvPointerTypeMouse:
			// "Right" button should only have "Up", "Down" events, we translate "Down" to "contextmenu",
			// and ignore "Up".
			if buttonList[i] == CsvButtonRight {
				if eventTypeList[i] == CsvEventTypeDown {
					eventType = EventTypeContextMenu
					button = buttonList[i]
				} else if eventTypeList[i] == CsvEventTypeUp {
					continue
				}  else if eventTypeList[i] == CsvEventTypeClick {
					// Click for (Mouse, Right)
					eventType = EventTypeContextMenu
					button = buttonList[i]
				} else {
					panic(errors.New(fmt.Sprintf("[%f] unknown event type: %s for (%s, %s)", timestamp, eventTypeList[i], pointerTypeList[i], buttonList[i])))
				}
			} else {
				switch eventTypeList[i] {
				case CsvEventTypeMove:
					eventType = EventTypeMouseMove
					if buttonList[i] != CsvButtonNone {
						panic(errors.New(fmt.Sprintf("[%f] unknown button: %s for (%s, %s)\n", timestamp, buttonList[i], pointerTypeList[i], eventTypeList[i])))
					}
				case CsvEventTypeClick:
					eventType = EventTypeClick
					button = buttonList[i]
					if button != CsvButtonLeft {
						fmt.Printf("[%f] unknown button: %s for (%s, %s)\n", timestamp, buttonList[i], pointerTypeList[i], eventTypeList[i])
					}
				case CsvEventTypeDown:
					eventType = EventTypeMouseDown
					button = buttonList[i]
					if button != CsvButtonLeft && button != CsvButtonRight && button != CsvButtonX1 && button != CsvButtonX2 {
						fmt.Printf("[%f] unknown button: %s for (%s, %s)\n", timestamp, buttonList[i], pointerTypeList[i], eventTypeList[i])
					}
				case CsvEventTypeUp:
					eventType = EventTypeMouseUp
					button = buttonList[i]
					if button != CsvButtonLeft && button != CsvButtonRight && button != CsvButtonX1 && button != CsvButtonX2 {
						fmt.Printf("[%f] unknown button: %s for (%s, %s)\n", timestamp, buttonList[i], pointerTypeList[i], eventTypeList[i])
					}
				default:
					panic(errors.New(fmt.Sprintf("[%f] unknown event type: %s for (%s, %s)", timestamp, eventTypeList[i], pointerTypeList[i], buttonList[i])))
				}
			}

		case CsvPointerTypeTouch:
			//fmt.Printf("[%f] unknown button: %s for (%s, %s)\n", timestamp, buttonList[i], pointerTypeList[i], eventTypeList[i])
			button = buttonList[i]
			if button != CsvButtonLeft && button != CsvButtonUnknown {
				fmt.Printf("[%f] unknown button: %s for (%s, %s)\n", timestamp, buttonList[i], pointerTypeList[i], eventTypeList[i])
			}

			switch eventTypeList[i] {
			case CsvEventTypeMove:
				eventType = EventTypeTouchMove
			case CsvEventTypeClick:
				eventType = EventTypeClick
			case CsvEventTypeDown:
				eventType = EventTypeTouchStart
			case CsvEventTypeUp:
				eventType = EventTypeTouchEnd
			default:
				panic(errors.New(fmt.Sprintf("[%f] unknown event type: %s for (%s, %s)", timestamp, eventTypeList[i], pointerTypeList[i], buttonList[i])))
			}

		case CsvPointerTypePen:
			//fmt.Printf("[%f] unknown button: %s for (%s, %s)\n", timestamp, buttonList[i], pointerTypeList[i], eventTypeList[i])
			button = buttonList[i]
			// "Pen" uses "None" button for "Move".
			// None for (Pen, Move)
			if button != CsvButtonLeft && button != CsvButtonUnknown && button != CsvButtonNone {
				fmt.Printf("[%f] unknown button: %s for (%s, %s)\n", timestamp, buttonList[i], pointerTypeList[i], eventTypeList[i])
			}

			switch eventTypeList[i] {
			case CsvEventTypeMove:
				eventType = EventTypeTouchMove
			case CsvEventTypeClick:
				eventType = EventTypeClick
			case CsvEventTypeDown:
				eventType = EventTypeTouchStart
			case CsvEventTypeUp:
				eventType = EventTypeTouchEnd
			default:
				panic(errors.New(fmt.Sprintf("[%f] unknown event type: %s for (%s, %s)", timestamp, eventTypeList[i], pointerTypeList[i], buttonList[i])))
			}

		default:
			panic(errors.New(fmt.Sprintf("[%f] unknown pointer type: %s for (%s, %s)", timestamp, pointerTypeList[i], eventTypeList[i], buttonList[i])))
		}

		t.AddEvent(timestamp, eventType, button, x, y)
	}

	t.SortEvents()
	normalizeWidthAndHeight(t, maxX, minX, maxY, minY)
}

func readCsvLine(sessions *[]*trace.Session, sessionMap *map[string]*trace.Session, impressions *[]*trace.Impression, impressionMap *map[string]*trace.Impression, websiteId string, line string, i int) {
	row := strings.SplitN(line, "\t", RowYList+1)

	t := trace.NewTrace(i)
	t.Url = row[RowUrl]

	isBot := row[RowIsBot]
	if isBot == "True" {
		t.Label = 1
	} else {
		t.Label = 0
	}

	timestampList := strings.Split(row[RowTimestampList], "|")
	eventTypeList := strings.Split(row[RowEventTypeList], "|")
	buttonList := strings.Split(row[RowButtonList], "|")
	pointerTypeList := strings.Split(row[RowPointerTypeList], "|")
	//t.PointerType = getUnifiedPointerType(pointerTypeList)
	xList := strings.Split(row[RowXList], "|")
	yList := strings.Split(row[RowYList], "|")
	addEventsToTrace(t, timestampList, eventTypeList, buttonList, pointerTypeList, xList, yList)

	//ss.AddTrace(t)

	sessionId := row[RowSessionId]
	impressionId := row[RowImpressionId]
	timestamp := row[RowTimestamp]
	url := row[RowUrl]
	userAgent := util.UnescapeUserAgent(row[RowUserAgent])
	clientIp := row[RowClientIp]
	addSession(sessions, sessionMap, sessionId, websiteId, timestamp, userAgent, clientIp)
	addImpression(impressions, impressionMap, impressionId, sessionId, websiteId, timestamp, url, userAgent, clientIp)
	appendTraceToImpression(impressionMap, impressionId, t)

	if i%1000 == 0 {
		fmt.Printf("[%d] Read trace a line\n", i)
	}
}
