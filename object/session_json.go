// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package object

type SessionJson struct {
	Id string `json:"id"`

	ImpressionCount int `json:"impressionCount"`

	TN int `json:"tn"`
	FP int `json:"fp"`
	FN int `json:"fn"`
	TP int `json:"tp"`
	UN int `json:"un"`

	RuleCounts []int `json:"ruleCounts"`
}
