// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package parse

import (
	"fmt"
	"go/ast"
	"strings"
)

func parseExpression(expr *ast.Expr) *Parameter {
	e, ok := (*expr).(*ast.BasicLit)
	if ok {
		// Literal value of int: 0, 1, 2, ...
		param := &Parameter{
			Type: strings.ToLower(e.Kind.String()),
			Name: e.Value,
		}
		return param
	}

	e2, ok := (*expr).(*ast.Ident)
	if ok {
		if e2.Obj == nil {
			// Literal value of boolean: true, false
			param := &Parameter{
				Type: "bool",
				Name: e2.Name,
			}
			return param
		} else {
			// Variable
			param := &Parameter{
				Type: strings.ToLower(e2.Obj.Kind.String()),
				Name: e2.Obj.Name,
			}
			return param
		}
	}

	e3, ok := (*expr).(*ast.BinaryExpr)
	if ok {
		// Binary expression like: i < 10
		op := e3.Op.String()
		left := parseExpression(&e3.X)
		right := parseExpression(&e3.Y)
		value := fmt.Sprintf("%s %s %s", left, op, right)

		param := &Parameter{
			Type: op,
			Name: value,
		}
		return param
	}

	e4, ok := (*expr).(*ast.ParenExpr)
	if ok {
		// Parentheses expression like: (1 + 2)
		inside := parseExpression(&e4.X)

		param := &Parameter{
			Type: "parentheses",
			Inside: inside,
		}
		return param
	}

	panic("parseExpression(): unknown expression type")
}
