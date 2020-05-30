// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package trace

type Event struct {
	Id        int     `json:"id"`
	Timestamp float64 `json:"timestamp"`
	Type      string  `json:"type"`
	Button    string  `json:"button"`
	X         int     `json:"x"`
	Y         int     `json:"y"`
	DeltaX    int     `json:"deltaX"`
	DeltaY    int     `json:"deltaY"`
	Width     int     `json:"width"`
	Height    int     `json:"height"`
}

var targetEventList = []string{
	"mousemove",
	"mousedown",
	"mouseup",
	"click",
	"dblclick",
	"contextmenu",
	"wheel",
	"touchstart",
	"touchmove",
	"touchend",
	"resize",
}

func array2Event(src []interface{}, dest *Event) {
	dest.Id = int(src[0].(float64))
	dest.Type = targetEventList[int(src[1].(float64))]
	dest.Timestamp = src[2].(float64)

	switch dest.Type {
	case "mousemove", "touchmove", "touchstart", "touchend": // (x,y)
		dest.X = int(src[3].(float64))
		dest.Y = int(src[4].(float64))
	case "wheel": // (x,y,deltaX,deltaY)
		dest.X = int(src[3].(float64))
		dest.Y = int(src[4].(float64))
		dest.DeltaX = int(src[5].(float64))
		dest.DeltaY = int(src[6].(float64))
	case "mouseup", "mousedown", "click", "dblclick", "contextmenu": // (x,y,button)
		dest.X = int(src[3].(float64))
		dest.Y = int(src[4].(float64))
		dest.Button = src[5].(string)
	case "resize": // (width,height)
		//dest.Width = int(src[3].(float64))
		//dest.Height = int(src[4].(float64))
		dest.Width = -1
		dest.Height = -1
	}
}
