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
		param := &Parameter{
			Type: strings.ToLower(e.Kind.String()),
			Name: e.Value,
		}
		return param
	}

	e2, ok := (*expr).(*ast.Ident)
	if ok {
		param := &Parameter{
			Type: strings.ToLower(e2.Obj.Kind.String()),
			Name: e2.Obj.Name,
		}
		return param
	}

	e3, ok := (*expr).(*ast.BinaryExpr)
	if ok {
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

	err := "parseExpression: unknown expr type"
	param := &Parameter{
		Type: err,
		Name: err,
	}
	return param
}
