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
	IsTrusted bool    `json:"isTrusted"`
}
