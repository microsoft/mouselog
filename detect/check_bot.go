// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package detect

import "github.com/microsoft/mouselog/trace"

func checkBot(events []*trace.Event) (int, string, int, int, int) {
	initEvents(events)

	isBot, reason, rule, start, end := checkOverspeed(events)
	if isBot != 0 {
		return isBot, reason, rule, start, end
	}

	isBot, reason, rule, start, end = checkSinglePoint(events)
	if isBot != 0 {
		return isBot, reason, rule, start, end
	}

	isBot, reason, rule, start, end = checkOverDistance(events)
	if isBot != 0 {
		return isBot, reason, rule, start, end
	}

	//isBot, reason, rule, start, end = checkRepeatedPoint(events)
	//if isBot != 0 {
	//	return isBot, reason, rule, start, end
	//}

	isBot, reason, rule, start, end = checkSameSpeed(events)
	if isBot != 0 {
		return isBot, reason, rule, start, end
	}

	isBot, reason, rule, start, end = checkStraightLine(events)
	if isBot != 0 {
		return isBot, reason, rule, start, end
	}

	isBot, reason, rule, start, end = checkAcceleration(events)
	if isBot != 0 {
		return isBot, reason, rule, start, end
	}

	isBot, reason, rule, start, end = checkRootlessClick(events)
	if isBot != 0 {
		return isBot, reason, rule, start, end
	}

	isBot, reason, rule, start, end = checkHighPointDensity(events)
	if isBot != 0 {
		return isBot, reason, rule, start, end
	}

	return 0, ReasonNone, RuleNone, -1, -1
}

func CheckBotForImpression(impression *trace.Impression) (int, string, int, int, int) {
	if impression == nil {
		return 0, ReasonNone, RuleNone, -1, -1
	}

	isBot, reason, rule, start, end := checkBot(impression.Events)
	impression.Guess = isBot
	impression.Reason = reason
	impression.RuleId = rule
	impression.RuleStart = start
	impression.RuleEnd = end

	return isBot, reason, rule, start, end
}

func CheckBotForTrace(t *trace.Trace) (int, string, int, int, int) {
	if t == nil {
		return 0, ReasonNone, RuleNone, -1, -1
	}

	isBot, reason, rule, start, end := checkBot(t.Events)
	t.Guess = isBot
	t.Reason = reason
	t.RuleId = rule
	t.RuleStart = start
	t.RuleEnd = end

	return isBot, reason, rule, start, end
}

func GetDetectResult(ss *trace.Session, traceId int) *trace.Session {
	t, ok := ss.TraceMap[traceId]
	if traceId != -1 || ok {
		CheckBotForTrace(t)
	}

	return ss
}
