package trace

import (
	"encoding/json"
	"testing"
)

func TestSessionToJson(t *testing.T) {
	ss := NewSession("123")
	ss.TraceMap["/"] = &Trace{
		Id:      "/",
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
