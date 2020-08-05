// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package batch

import (
	"bufio"
	"fmt"
	"os"

	"github.com/microsoft/mouselog/trace"
	"github.com/microsoft/mouselog/util"
)

// https://developer.mozilla.org/en-US/docs/Web/Events
const (
	EventTypeClick       = "click"
	EventTypeContextMenu = "contextmenu"
	EventTypeMouseDown   = "mousedown"
	EventTypeMouseMove   = "mousemove"
	EventTypeMouseUp     = "mouseup"
	EventTypeTouchStart  = "touchstart"
	EventTypeTouchMove   = "touchmove"
	EventTypeTouchEnd    = "touchend"
)

const (
	ButtonLeft  = "Left"
	ButtonRight = "Right"
)

func getFloor(i int) int {
	i = i - i%100 - 100
	if i < 0 {
		i = 0
	}
	return i
}

func getCeil(i int) int {
	return i - i%100 + 200
}

func normalizeWidthAndHeight(t *trace.Trace, maxX int, minX int, maxY int, minY int) {
	t.Width = getCeil(maxX)
	t.Height = getCeil(maxY)

	floorX := getFloor(minX)
	floorY := getFloor(minY)
	for i := 0; i < len(t.Events); i++ {
		t.Events[i].X -= floorX
		t.Events[i].Y -= floorY
	}
	t.Width -= floorX
	t.Height -= floorY
}

func ReadTraces(fileId string) {
	fmt.Printf("Read traces for file: [%s].\n", fileId)

	var path string
	path = util.GetCsvDataPath(fileId)
	//path = util.GetTsvDataPath(fileId)
	websiteId := fileId

	sessions := []*trace.Session{}
	sessionMap := map[string]*trace.Session{}
	impressions := []*trace.Impression{}
	impressionMap := map[string]*trace.Impression{}

	file, err := os.Open(path)
	if err != nil {
		panic(err)
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	const maxCapacity = 1024 * 1024 * 8
	buf := make([]byte, maxCapacity)
	scanner.Buffer(buf, maxCapacity)
	i := 0
	for scanner.Scan() {
		line := scanner.Text()

		readCsvLine(&sessions, &sessionMap, &impressions, &impressionMap, websiteId, line, i)
		//readTsvLine(&sessions, &sessionMap, &impressions, &impressionMap, websiteId, line, i)

		i += 1
	}

	if err := scanner.Err(); err != nil {
		panic(err)
	}

	fmt.Printf("Delete sessions for file: [%s].\n", fileId)
	trace.DeleteSessions(websiteId)
	fmt.Printf("Add sessions for file: [%s].\n", fileId)
	trace.AddSessionsSafe(sessions)
	fmt.Printf("Delete impressions for file: [%s].\n", fileId)
	trace.DeleteImpressions(websiteId)
	fmt.Printf("Add impressions for file: [%s].\n", fileId)
	trace.AddImpressionsSafe(impressions)
}
