// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package detect

import "github.com/microsoft/mouselog/trace"

func SyncGuesses(ss *trace.Session) {
	for _, t := range ss.Traces {
		CheckBotForTrace(t)
	}
}
