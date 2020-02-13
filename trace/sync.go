// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package trace

func (ss *Session) SyncStatistics() {
	for _, t := range ss.Traces {
		if t.Label == 0 {
			if t.Guess == 0 {
				ss.TN += 1
			} else if t.Guess == 1 {
				ss.FP += 1
			} else {
				ss.UN += 1
			}
		} else if t.Label == 1 {
			if t.Guess == 0 {
				ss.FN += 1
			} else if t.Guess == 1 {
				ss.TP += 1
			} else {
				ss.UN += 1
			}
		} else {
			ss.UN += 1
		}
	}
}
