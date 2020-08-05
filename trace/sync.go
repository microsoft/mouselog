// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package trace

func (ss *Session) SyncStatistics() {
	for _, impression := range ss.Impressions {
		if impression.Label == 0 {
			if impression.Guess == 0 {
				ss.TN += 1
			} else if impression.Guess == 1 {
				ss.FP += 1
			} else {
				ss.UN += 1
			}
		} else if impression.Label == 1 {
			if impression.Guess == 0 {
				ss.FN += 1
			} else if impression.Guess == 1 {
				ss.TP += 1
			} else {
				ss.UN += 1
			}
		} else {
			ss.UN += 1
		}
	}
}
