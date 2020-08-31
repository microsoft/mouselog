// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package detect

import (
	"fmt"
	"math"
	"sort"

	"github.com/microsoft/mouselog/object"
)

var DensityLimit = 30

type TraceFragment struct {
	Count int
	Start int
	End   int
}

func checkHighPointDensity(events []*object.Event) (int, string, int, int, int) {
	m := map[int]*TraceFragment{}
	for i, e := range events {
		key := int(math.Floor(e.Timestamp))
		if _, ok := m[key]; ok {
			m[key].Count += 1
			m[key].End = i + 1
		} else {
			m[key] = &TraceFragment{
				Count: 1,
				Start: i,
				End:   i + 1,
			}
		}
	}

	frags := []*TraceFragment{}
	for _, v := range m {
		frags = append(frags, v)
	}

	sort.Slice(frags, func(i, j int) bool {
		return frags[i].Count < frags[j].Count
	})
	frag := frags[0]

	if frag.Count > DensityLimit {
		return 1, fmt.Sprintf("pointer density too high (%d > %d pixels/s) in 1 second", frag.Count, DensityLimit), RuleHighPointDensity, frag.Start, frag.End
	}

	return 0, ReasonNone, RuleNone, -1, -1
}
