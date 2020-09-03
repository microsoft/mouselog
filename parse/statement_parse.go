// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package parse

import (
	"go/ast"
	"strings"
)

func parseCallStatement(stmt *ast.ExprStmt, level int) *Statement {
	expr := stmt.X.(*ast.CallExpr)

	fun := expr.Fun.(*ast.SelectorExpr)
	x := fun.X.(*ast.Ident).Name
	sel := fun.Sel.Name
	name := x + "." + sel

	exprs := []*Expression{}
	for _, arg := range expr.Args {
		expr := parseExpression(&arg)
		exprs = append(exprs, expr)
	}

	s := &Statement{
		Level: level,
		Name:  name,
		Args:  exprs,
	}
	return s
}

func parseAssignStatement(stmt *ast.AssignStmt, level int) *Statement {
	left := stmt.Lhs[0]
	right := stmt.Rhs[0]
	leftExpr := parseExpression(&left)
	rightExpr := parseExpression(&right)

	s := &Statement{
		Level: level,
		Name:  strings.ToLower(stmt.Tok.String()),
		Args:  []*Expression{leftExpr, rightExpr},
	}
	return s
}

func parseForStatement(stmt *ast.ForStmt, level int) *Statement {
	s := &Statement{
		Level: level,
		Name: "for",
	}

	s.Init = parseStatement(&stmt.Init, 0)
	s.Cond = parseExpression(&stmt.Cond)
	s.Post = parseStatement(&stmt.Post, 0)

	s.Body = []*Statement{}
	for _, stmt2 := range stmt.Body.List {
		s.Body = append(s.Body, parseStatement(&stmt2, level+1))
	}

	return s
}

func parseReturnStatement(stmt *ast.ReturnStmt, level int) *Statement {
	exprs := []*Expression{}
	for _, result := range stmt.Results {
		expr := parseExpression(&result)
		exprs = append(exprs, expr)
	}

	s := &Statement{
		Level: level,
		Name:  "return",
		Args:  exprs,
	}
	return s
}

func parseIncDecStatement(stmt *ast.IncDecStmt, level int) *Statement {
	exprs := []*Expression{}
	expr := &Expression{
		Type: "",
		Name: stmt.X.(*ast.Ident).Name,
	}
	exprs = append(exprs, expr)

	s := &Statement{
		Level: level,
		Name:  strings.ToLower(stmt.Tok.String()),
		Args:  exprs,
	}
	return s
}

func parseIfStatement(stmt *ast.IfStmt, level int) *Statement {
	s := &Statement{
		Level: level,
		Name: "if",
	}

	s.Cond = parseExpression(&stmt.Cond)

	s.Body = []*Statement{}
	for _, stmt2 := range stmt.Body.List {
		s.Body = append(s.Body, parseStatement(&stmt2, level+1))
	}

	return s
}

func parseBranchStatement(stmt *ast.BranchStmt, level int) *Statement {
	s := &Statement{
		Level: level,
		Name: strings.ToLower(stmt.Tok.String()), // Can be "break",
	}

	return s
}

func parseStatement(stmt *ast.Stmt, level int) *Statement {
	e, ok := (*stmt).(*ast.ExprStmt)
	if ok {
		return parseCallStatement(e, level)
	}

	e2, ok := (*stmt).(*ast.AssignStmt)
	if ok {
		return parseAssignStatement(e2, level)
	}

	e3, ok := (*stmt).(*ast.ForStmt)
	if ok {
		return parseForStatement(e3, level)
	}

	e4, ok := (*stmt).(*ast.ReturnStmt)
	if ok {
		return parseReturnStatement(e4, level)
	}

	e5, ok := (*stmt).(*ast.IncDecStmt)
	if ok {
		return parseIncDecStatement(e5, level)
	}

	e6, ok := (*stmt).(*ast.IfStmt)
	if ok {
		return parseIfStatement(e6, level)
	}

	e7, ok := (*stmt).(*ast.BranchStmt)
	if ok {
		return parseBranchStatement(e7, level)
	}

	panic("parseStatement(): unknown statement type")
}
