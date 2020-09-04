// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package parse

import "go/ast"

func parseParameter(field *ast.Field) *Expression {
	expr := &Expression{
		Type:     ExpressionTypeParameter,
		Name:     field.Names[0].Name,
		NameType: field.Type.(*ast.Ident).Name,
	}
	return expr
}

func parseResult(field *ast.Field) *Expression {
	expr := &Expression{
		Type:     ExpressionTypeResult,
		NameType: field.Type.(*ast.Ident).Name,
	}
	return expr
}

func parseFunction(fd *ast.FuncDecl, level int) *Function {
	name := fd.Name.Name

	params := []*Expression{}
	for _, field := range fd.Type.Params.List {
		param := parseParameter(field)
		params = append(params, param)
	}

	results := []string{}
	for _, field := range fd.Type.Results.List {
		f := parseResult(field)
		results = append(results, f.NameType)
	}

	stmts := []*Statement{}
	for _, stmt := range fd.Body.List {
		s := parseStatement(&stmt, level+1)
		stmts = append(stmts, s)
	}

	f := &Function{
		Level:      level,
		Name:       name,
		Params:     params,
		Results:    results,
		Statements: stmts,
	}
	return f
}
