// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package parse

import (
	"go/ast"
	"go/parser"
	"go/token"
	"log"
	"strings"
)

func parseStatement(expr *ast.Stmt) *Statement {
	e, ok := (*expr).(*ast.ExprStmt)
	if ok {
		callExpr := e.X.(*ast.CallExpr)
		fun := callExpr.Fun.(*ast.SelectorExpr)
		x := fun.X.(*ast.Ident).Name
		sel := fun.Sel.Name
		name := x + "." + sel

		params := []*Parameter{}
		for _, arg := range callExpr.Args {
			a := arg.(*ast.BasicLit)
			param := &Parameter{
				Type: strings.ToLower(a.Kind.String()),
				Name: a.Value,
			}
			params = append(params, param)
		}

		s := &Statement{
			Name: name,
			Args: params,
		}
		return s
	}

	e2, ok := (*expr).(*ast.ReturnStmt)
	if ok {
		params := []*Parameter{}
		for _, result := range e2.Results {
			r := result.(*ast.BasicLit)
			param := &Parameter{
				Type: strings.ToLower(r.Kind.String()),
				Name: r.Value,
			}
			params = append(params, param)
		}

		s := &Statement{
			Name: "return",
			Args: params,
		}
		return s
	}

	return nil
}

func parseFunction(fd *ast.FuncDecl) *Function {
	name := fd.Name.Name

	params := []*Parameter{}
	for _, field := range fd.Type.Params.List {
		param := &Parameter{
			Type: field.Type.(*ast.Ident).Name,
			Name: field.Names[0].Name,
		}
		params = append(params, param)
	}

	results := []string{}
	for _, field := range fd.Type.Results.List {
		result := field.Type.(*ast.Ident).Name
		results = append(results, result)
	}

	stmts := []*Statement{}
	for _, stmt := range fd.Body.List {
		s := parseStatement(&stmt)
		stmts = append(stmts, s)
	}

	f := &Function{
		Name:    name,
		Params:  params,
		Results: results,
		Statements: stmts,
	}
	return f
}

func parseFile() {
	fset := token.NewFileSet()
	node, err := parser.ParseFile(fset, "test.go", nil, parser.ParseComments)
	if err != nil {
		log.Fatal(err)
	}

	for _, f := range node.Decls {
		fd, ok := f.(*ast.FuncDecl)
		if !ok {
			continue
		}

		f := parseFunction(fd)
		println(f.String())
	}
}
