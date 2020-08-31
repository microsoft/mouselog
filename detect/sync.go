// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package detect

import "github.com/microsoft/mouselog/object"

func SyncGuesses(ss *object.Session) {
	ss.Impressions = object.GetImpressionsAll(ss.Id, "", "")
	for _, impression := range ss.Impressions {
		CheckBotForImpression(impression)
	}
}
