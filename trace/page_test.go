// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package trace

import "testing"

func TestPageScreenshot(t *testing.T) {
	InitOrmManager()

	pages := GetPages("casbin")
	for _, page := range pages {
		page.takeScreenshot()
	}
}
