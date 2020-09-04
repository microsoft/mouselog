// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package parse

import (
	"fmt"
	"go/ast"
	"strings"
)

func parseLiteralExpression(expr *ast.BasicLit) *Expression {
	// Literal value of int: 0, 1, 2, ...
	res := &Expression{
		Type:     ExpressionTypeDefault,
		Name:     expr.Value,
		NameType: strings.ToLower(expr.Kind.String()),
	}
	return res
}

func parseIdentifierExpression(expr *ast.Ident) *Expression {
	if expr.Obj == nil {
		// Literal value of boolean:
		//true, false
		res := &Expression{
			Type:     ExpressionTypeDefault,
			Name:     expr.Name,
			NameType: "bool", // bool
		}
		return res
	} else {
		// Variable
		res := &Expression{
			Type:     ExpressionTypeDefault,
			Name:     expr.Obj.Name,
			NameType: strings.ToLower(expr.Obj.Kind.String()), // int, string, ..
		}
		return res
	}
}

func parseBinaryExpression(expr *ast.BinaryExpr) *Expression {
	// Binary expression like:
	// i < 10
	op := expr.Op.String()
	left := parseExpression(&expr.X)
	right := parseExpression(&expr.Y)
	value := fmt.Sprintf("%s %s %s", left, op, right)

	res := &Expression{
		Type:     ExpressionTypeDefault,
		Name:     value,
		NameType: op,
	}
	return res
}

func parseParenthesesExpression(expr *ast.ParenExpr) *Expression {
	// Parentheses expression like:
	// (1 + 2)
	inside := parseExpression(&expr.X)

	res := &Expression{
		Type:     ExpressionTypeParentheses,
		Children: Expressions{inside},
	}
	return res
}

func parseArrayExpression(expr *ast.CompositeLit) *Expression {
	// Composite literal like:
	// []int{1, 2}
	nameType := expr.Type.(*ast.ArrayType).Elt.(*ast.Ident).Name
	res := &Expression{
		Type: ExpressionTypeArray,
		NameType: nameType + "*", // int*
	}

	res.Children = Expressions{}
	for _, elt := range expr.Elts {
		res.Children = append(res.Children, parseExpression(&elt))
	}
	return res
}

func parseCallExpression(expr *ast.CallExpr) *Expression {
	// Call expression like:
	// append(array, 1)
	res := &Expression{
		Type: ExpressionTypeCall,
		Name: expr.Fun.(*ast.Ident).Name,
	}

	res.Children = Expressions{}
	for _, arg := range expr.Args {
		res.Children = append(res.Children, parseExpression(&arg))
	}
	return res
}

func parseIndexExpression(expr *ast.IndexExpr) *Expression {
	// Index expression like:
	// array[123]
	index := parseExpression(&expr.Index)

	res := &Expression{
		Type:     ExpressionTypeIndex,
		Name:     expr.X.(*ast.Ident).Name, // array
		Children: Expressions{index},       // 123
	}
	return res
}

func parseExpression(expr *ast.Expr) *Expression {
	e, ok := (*expr).(*ast.BasicLit)
	if ok {
		return parseLiteralExpression(e)
	}

	e2, ok := (*expr).(*ast.Ident)
	if ok {
		return parseIdentifierExpression(e2)
	}

	e3, ok := (*expr).(*ast.BinaryExpr)
	if ok {
		return parseBinaryExpression(e3)
	}

	e4, ok := (*expr).(*ast.ParenExpr)
	if ok {
		return parseParenthesesExpression(e4)
	}

	e5, ok := (*expr).(*ast.CompositeLit)
	if ok {
		return parseArrayExpression(e5)
	}

	e6, ok := (*expr).(*ast.CallExpr)
	if ok {
		return parseCallExpression(e6)
	}

	e7, ok := (*expr).(*ast.IndexExpr)
	if ok {
		return parseIndexExpression(e7)
	}

	panic("parseExpression(): unknown expression type")
}
