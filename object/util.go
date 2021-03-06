// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package object

import "time"

func getCurrentTime() string {
	timestamp := time.Now().Unix()
	tm := time.Unix(timestamp, 0)
	return tm.Format(time.RFC3339)
}

