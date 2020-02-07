package trace

import (
	"errors"
	"fmt"
	"math"
	"strconv"
	"strings"

	"github.com/microsoft/mouselog/util"
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

func readCsvLine(ss *Session, line string, i int) {
	row := strings.SplitN(line, ",", RowYList+1)

	t := newTrace(strconv.Itoa(i))
	//t.RequestId = row[RowRequestId]
	//t.Timestamp = row[RowTimestamp]
	t.Url = row[RowUrl]
	//t.UserAgent = util.UnescapeUserAgent(row[RowUserAgent])
	//t.ClientIp = row[RowClientIp]

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

		t.addEvent(timestamp, eventType, button, x, y)
	}

	t.sortEvents()
	normalizeWidthAndHeight(t, maxX, minX, maxY, minY)

	ss.AddTrace(t)

	if i%1000 == 0 {
		fmt.Printf("[%d] Read trace a line\n", i)
	}
}
