package detect

import "github.com/microsoft/mouselog/trace"

func SyncGuesses(ss *trace.Session) {
	for _, t := range ss.Traces {
		CheckBot(t)
	}
}
