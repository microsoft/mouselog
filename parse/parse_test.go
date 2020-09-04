// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package parse

import "testing"

func TestParseFile(t *testing.T) {
	println()
	parseFile("../detect/rule_single_point.go")
	println()
}
