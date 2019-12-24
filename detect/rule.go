package detect

const (
	RuleNone = iota
	RuleStraightLine
	RuleEquallySpacedPoints
	RuleSinglePoint
	RuleOverspeed
)

const ReasonNone = ""

func GetRuleName(rule int) string {
	switch rule {
	case RuleNone:
		return "Human"
	case RuleStraightLine:
		return "Straight line found"
	case RuleEquallySpacedPoints:
		return "Multiple equally spaced points found"
	case RuleSinglePoint:
		return "Only one point found"
	case RuleOverspeed:
		return "Pointer speed too fast"
	default:
		return ""
	}
}

type RuleJson struct {
	RuleId   int    `json:"ruleId"`
	RuleName string `json:"ruleName"`
}

func GetRuleListJson() []*RuleJson {
	res := []*RuleJson{}

	for ruleId := RuleNone; ruleId <= RuleOverspeed; ruleId ++ {
		res = append(res, &RuleJson{
			RuleId:   ruleId,
			RuleName: GetRuleName(ruleId),
		})
	}

	return res
}
