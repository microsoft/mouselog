// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package trace

import (
	"encoding/json"
	"testing"
)

func TestSessionToJson(t *testing.T) {
	ss := NewSession("123")
	ss.TraceMap[0] = &Trace{
		Id:      0,
		Width:   800,
		Height:  600,
		Events:  nil,
		Degrees: nil,
	}

	res, err := json.Marshal(ss)
	if err != nil {
		panic(err)
	}

	s := string(res)
	println(s)
}
