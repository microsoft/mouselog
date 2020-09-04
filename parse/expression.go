// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package parse

import (
	"fmt"
	"strings"
)

type Expression struct {
	Type     int
	Name     string
	NameType string

	Children Expressions
}

const (
	ExpressionTypeDefault = iota
	ExpressionTypeParentheses
	ExpressionTypeArray
	ExpressionTypeCall
	ExpressionTypeIndex
	ExpressionTypeParameter
	ExpressionTypeResult
)

func (expr *Expression) String() string {
	//return fmt.Sprintf("%s:%s", expr.Type, expr.Name)
	res := ""
	switch expr.Type {
	case ExpressionTypeParameter:
		// int a
		res = fmt.Sprintf("%s %s", expr.NameType, expr.Name)
	case ExpressionTypeParentheses:
		// (1 + 2)
		res = fmt.Sprintf("(%s)", expr.Children[0])
	case ExpressionTypeArray:
		// []int{1, 2}
		res = fmt.Sprintf("%s{%s}", expr.NameType, expr.Children)
	case ExpressionTypeCall:
		// append(array, 1)
		res = fmt.Sprintf("%s(%s)", expr.Name, expr.Children)
	case ExpressionTypeIndex:
		// array[123]
		res = fmt.Sprintf("%s[%s]", expr.Name, expr.Children)
	default:
		res = expr.Name
	}

	if IsVerbose {
		return fmt.Sprintf("<expr type=\"%d\" name=\"%s\" nametype=\"%s\">%s</expr>", expr.Type, expr.Name, expr.NameType, res)
	} else {
		return res
	}
}

type Expressions []*Expression

func (exprs Expressions) String() string {
	res := []string{}
	for _, expr := range exprs {
		res = append(res, expr.String())
	}
	return strings.Join(res, ", ")
}
