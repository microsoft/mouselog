// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package detect

import "github.com/microsoft/mouselog/trace"

func SyncGuesses(ss *trace.Session) {
	ss.Impressions = trace.GetImpressionsAll(ss.Id, 10000000, 0, "", "")
	for _, impression := range ss.Impressions {
		CheckBotForImpression(impression)
	}
}
