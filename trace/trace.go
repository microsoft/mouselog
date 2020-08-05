// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package trace

import (
	"encoding/json"
	"sort"
)

type Trace struct {
	Id           int    `json:"batchId"`
	PacketId     int    `json:"packetId"`
	Url          string `json:"url"`
	Path         string `json:"path"`
	Width        int    `json:"width"`
	Height       int    `json:"height"`
	PageLoadTime string `json:"pageLoadTime"`
	Referrer     string `json:"referrer"`

	Label     int    `json:"label"`
	Guess     int    `json:"guess"`
	Reason    string `json:"reason"`
	RuleId    int    `json:"ruleId"`
	RuleStart int    `json:"ruleStart"`
	RuleEnd   int    `json:"ruleEnd"`

	Events  []Event   `json:"events"`
}

func NewTrace(id int) *Trace {
	t := Trace{}
	t.Id = id
	t.Label = -1
	t.Guess = -1
	t.RuleStart = -1
	t.RuleEnd = -1
	t.Events = []Event{}
	return &t
}

func (t *Trace) AddEvent(timestamp float64, typ string, button string, x int, y int) {
	e := Event{
		Id:        len(t.Events),
		Timestamp: timestamp,
		Type:      typ,
		Button:    button,
		X:         x,
		Y:         y,
	}

	t.Events = append(t.Events, e)
}

func (t *Trace) SortEvents() {
	sort.Slice(t.Events, func(i, j int) bool {
		return t.Events[i].Timestamp < t.Events[j].Timestamp
	})

	for i := 0; i < len(t.Events); i++ {
		t.Events[i].Id = i
	}
}

func (t *Trace) LoadFromJson(b []byte) {
	var f map[string]interface{}
	err := json.Unmarshal(b, &f)
	if err != nil {
		panic(err)
	}

	t.Id = int(f["batchId"].(float64))
	t.PacketId = int(f["packetId"].(float64))
	t.Height = int(f["height"].(float64))
	t.Width = int(f["width"].(float64))
	t.PageLoadTime = f["pageLoadTime"].(string)
	t.Referrer = f["referrer"].(string)
	t.Url = f["url"].(string)
	t.Path = f["path"].(string)
	events := f["events"].([]interface{})

	for _, arr := range events {
		var event Event
		array2Event(arr.([]interface{}), &event)
		t.Events = append(t.Events, event)
	}
}
