package detect

import "github.com/microsoft/mouselog/trace"

func checkBot(t *trace.Trace) (int, string, int, int, int) {
	//isBot, reason, rule, start, end := checkStraightLine(t)
	//if isBot != 0 {
	//	return isBot, reason, rule, start, end
	//}

	isBot, reason, rule, start, end := checkSinglePoint(t)
	if isBot != 0 {
		return isBot, reason, rule, start, end
	}

	isBot, reason, rule, start, end = checkOverspeed(t)
	if isBot != 0 {
		return isBot, reason, rule, start, end
	}

	isBot, reason, rule, start, end = checkRootlessClick(t)
	if isBot != 0 {
		return isBot, reason, rule, start, end
	}

	isBot, reason, rule, start, end = checkHighPointDensity(t)
	if isBot != 0 {
		return isBot, reason, rule, start, end
	}

	isBot, reason, rule, start, end = checkNegativeCursor(t)
	if isBot != 0 {
		return isBot, reason, rule, start, end
	}

	return 0, ReasonNone, RuleNone, -1, -1
}

func CheckBot(t *trace.Trace) (int, string, int, int, int) {
	if t == nil {
		return 0, ReasonNone, RuleNone, -1, -1
	}

	isBot, reason, rule, start, end := checkBot(t)
	t.Guess = isBot
	t.Reason = reason
	t.RuleId = rule
	t.RuleStart = start
	t.RuleEnd = end

	return isBot, reason, rule, start, end
}

func GetDetectResult(ss *trace.Session, traceId string) *trace.Session {
	t, ok := ss.TraceMap[traceId]
	if traceId != "" || ok {
		CheckBot(t)
	}

	return ss
}
