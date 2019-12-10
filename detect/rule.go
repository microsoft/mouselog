package detect

const (
	RuleNone = iota
	RuleStraightLine
	RuleEquallySpacedPoints
	RuleSinglePoint
	RuleOverspeed
)

func GetRuleName(rule int) string {
	switch rule {
	case RuleStraightLine:
		return "Straight line found"
	case RuleEquallySpacedPoints:
		return "Multiple equally spaced points found"
	default:
		return ""
	}
}
