// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package detect

//func checkRepeatedPoint(events []*trace.Event) (int, string, int, int, int) {
//	for i := 1; i < len(events); i ++ {
//		if events[i].Type == "mousemove" && events[i-1].Type == "mousemove" || events[i].Type == "touchmove" && events[i-1].Type == "touchmove" {
//			if events[i].X == events[i-1].X && events[i].Y == events[i-1].Y {
//				return 1, "repeated point found", RuleRepeatedPoint, i, -1
//			}
//		}
//	}
//
//	return 0, ReasonNone, RuleNone, -1, -1
//}
