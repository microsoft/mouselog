// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package parse

import (
	"fmt"
	"go/ast"
	"strings"
)

func parseExpression(expr *ast.Expr) *Expression {
	e, ok := (*expr).(*ast.BasicLit)
	if ok {
		// Literal value of int: 0, 1, 2, ...
		res := &Expression{
			Type: strings.ToLower(e.Kind.String()),
			Name: e.Value,
		}
		return res
	}

	e2, ok := (*expr).(*ast.Ident)
	if ok {
		if e2.Obj == nil {
			// Literal value of boolean: true, false
			res := &Expression{
				Type: "bool",
				Name: e2.Name,
			}
			return res
		} else {
			// Variable
			res := &Expression{
				Type: strings.ToLower(e2.Obj.Kind.String()),
				Name: e2.Obj.Name,
			}
			return res
		}
	}

	e3, ok := (*expr).(*ast.BinaryExpr)
	if ok {
		// Binary expression like: i < 10
		op := e3.Op.String()
		left := parseExpression(&e3.X)
		right := parseExpression(&e3.Y)
		value := fmt.Sprintf("%s %s %s", left, op, right)

		res := &Expression{
			Type: op,
			Name: value,
		}
		return res
	}

	e4, ok := (*expr).(*ast.ParenExpr)
	if ok {
		// Parentheses expression like: (1 + 2)
		inside := parseExpression(&e4.X)

		res := &Expression{
			Type: "parentheses",
			Inside: inside,
		}
		return res
	}

	panic("parseExpression(): unknown expression type")
}
