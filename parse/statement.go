// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package parse

import (
	"go/ast"
	"strings"
)

func parseCallStatement(stmt *ast.ExprStmt) *Statement {
	expr := stmt.X.(*ast.CallExpr)

	fun := expr.Fun.(*ast.SelectorExpr)
	x := fun.X.(*ast.Ident).Name
	sel := fun.Sel.Name
	name := x + "." + sel

	params := []*Parameter{}
	for _, arg := range expr.Args {
		param := parseExpression(&arg)
		params = append(params, param)
	}

	s := &Statement{
		Name: name,
		Args: params,
	}
	return s
}

func parseAssignStatement(stmt *ast.AssignStmt) *Statement {
	leftExpr := stmt.Lhs[0]
	rightExpr := stmt.Rhs[0]
	leftParam := parseExpression(&leftExpr)
	rightParam := parseExpression(&rightExpr)

	s := &Statement{
		Name: strings.ToLower(stmt.Tok.String()),
		Args: []*Parameter{leftParam, rightParam},
	}
	return s
}

func parseForStatement(stmt *ast.ForStmt) *Statement {
	s := &Statement{
		Name: "for",
	}

	s.Init = parseStatement(&stmt.Init)
	s.Cond = parseExpression(&stmt.Cond)
	s.Post = parseStatement(&stmt.Post)

	s.Body = []*Statement{}
	for _, stmt2 := range stmt.Body.List {
		s.Body = append(s.Body, parseStatement(&stmt2))
	}

	return s
}

func parseReturnStatement(stmt *ast.ReturnStmt) *Statement {
	params := []*Parameter{}
	for _, result := range stmt.Results {
		param := parseExpression(&result)
		params = append(params, param)
	}

	s := &Statement{
		Name: "return",
		Args: params,
	}
	return s
}

func parseStatement(stmt *ast.Stmt) *Statement {
	e, ok := (*stmt).(*ast.ExprStmt)
	if ok {
		return parseCallStatement(e)
	}

	e2, ok := (*stmt).(*ast.AssignStmt)
	if ok {
		return parseAssignStatement(e2)
	}

	e3, ok := (*stmt).(*ast.ForStmt)
	if ok {
		return parseForStatement(e3)
	}

	e4, ok := (*stmt).(*ast.ReturnStmt)
	if ok {
		return parseReturnStatement(e4)
	}

	return nil
}
