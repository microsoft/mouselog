// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package batch

import (
	"fmt"
	"strings"

	"github.com/microsoft/mouselog/object"
	"github.com/microsoft/mouselog/util"
)

const (
	TRowSessionId = iota
	TRowImpressionId
	TRowUnifiedId
	TRowVertical
	TRowTimestamp
	TRowPageName
	TRowClientIp
	TRowUserAgent
	TRowIsBot
	TRowPageClickCount
	TRowDwellTime
	TRowHasPerfPing
	TRowUrl
	TRowMouselogData
)

func addJsonToTrace(t *object.Trace, data string) {
	if data != "" {
		data = strings.Trim(data, "\"")
		data = strings.ReplaceAll(data, "\"\"", "\"")
		t.LoadFromJson([]byte(data))
	}
}

func readTsvLine(sessions *[]*object.Session, sessionMap *map[string]*object.Session, impressions *[]*object.Impression, impressionMap *map[string]*object.Impression, websiteId string, line string, i int) {
	row := strings.SplitN(line, "\t", TRowMouselogData+1)

	t := object.NewTrace(i)
	t.Url = row[TRowUrl]

	isBot := row[TRowIsBot]
	if isBot == "True" {
		t.Label = 1
	} else {
		t.Label = 0
	}

	addJsonToTrace(t, row[TRowMouselogData])

	//ss.AddTrace(t)

	sessionId := row[TRowSessionId]
	impressionId := row[TRowImpressionId]
	timestamp := row[TRowTimestamp]
	url := row[TRowUrl]
	userAgent := util.UnescapeUserAgent(row[TRowUserAgent])
	clientIp := row[TRowClientIp]
	addSession(sessions, sessionMap, sessionId, websiteId, timestamp, userAgent, clientIp)
	addImpression(impressions, impressionMap, impressionId, sessionId, websiteId, timestamp, url, userAgent, clientIp)
	appendTraceToImpression(impressionMap, impressionId, t)

	if i%1000 == 0 {
		fmt.Printf("[%d] Read trace a line\n", i)
	}
}
