// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package parse

func getIndent(level int) string {
	if level == 0 {
		return ""
	} else if level == 1 {
		return "    "
	} else if level == 2 {
		return "        "
	} else if level == 3 {
		return "            "
	} else {
		panic("getIndent(): not supported level")
	}
}
