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

func UnescapeUserAgent(userAgent string) string {
	return strings.Replace(userAgent, "#TAB#", ",", -1)
}
