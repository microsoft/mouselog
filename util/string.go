// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package util

import (
	"strconv"
	"strings"
)

func ParseInt(s string) int {
	i, err := strconv.Atoi(s)
	if err != nil {
		panic(err)
	}

	return i
}

func ParseFloat(s string) float64 {
	f, err := strconv.ParseFloat(s, 64)
	if err != nil {
		panic(err)
	}

	return f
}

func FormatFloat(f float64) string {
	return strconv.FormatFloat(f, 'f', -1, 64)
}

func UnescapeUserAgent(userAgent string) string {
	return strings.Replace(userAgent, "#TAB#", ",", -1)
}

func UniqueStringSlice(l []string) []string {
	keys := make(map[string]bool)
	list := []string{}
	for _, entry := range l {
		if _, value := keys[entry]; !value {
			keys[entry] = true
			list = append(list, entry)
		}
	}
	return list
}
