// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package detect

const (
	RuleNone = iota
	RuleOverspeed
	RuleSinglePoint
	RuleOverDistance
	RuleAcuteAngle
	//RuleRepeatedPoint
	RuleSameSpeed
	RuleStraightLine
	RuleAccelerationBeforeClick
	//RuleNearStraightLine
	RuleEquallySpacedPoints
	RuleRootlessClick
	RuleHighPointDensity
	//RuleNegativeCursor
	//RuleTimeConflict
	RuleUpperLimit
)

const ReasonNone = ""

func GetRuleName(rule int) string {
	switch rule {
	case RuleNone:
		return "Human"
	case RuleOverspeed:
		return "Pointer speed too fast"
	case RuleSinglePoint:
		return "Single point found"
	case RuleOverDistance:
		return "Pointer distance too long"
	case RuleAcuteAngle:
		return "acute angles too many"
	//case RuleRepeatedPoint:
	//	return "Repeated point found"
	case RuleSameSpeed:
		return "Pointer speed standard deviation too small"
	case RuleStraightLine:
		return "Straight line found"
	case RuleAccelerationBeforeClick:
		return "Acceleration before click abnormal"
	//case RuleNearStraightLine:
	//	return "Near straight line found"
	case RuleEquallySpacedPoints:
		return "Multiple equally spaced points found"
	case RuleRootlessClick:
		return "Rootless click found"
	case RuleHighPointDensity:
		return "Point density too high"
	//case RuleNegativeCursor:
	//	return "Negative cursor found"
	//case RuleTimeConflict:
	//	return "Time conflict found"
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

	for ruleId := RuleNone; ruleId < RuleUpperLimit; ruleId ++ {
		res = append(res, &RuleJson{
			RuleId:   ruleId,
			RuleName: GetRuleName(ruleId),
		})
	}

	return res
}
