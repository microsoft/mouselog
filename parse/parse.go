// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package parse

import (
	"go/ast"
	"go/parser"
	"go/token"
	"log"
)

func parseField(field *ast.Field) *Parameter {
	param := &Parameter{
		Type: field.Type.(*ast.Ident).Name,
	}

	if len(field.Names) > 0 {
		param.Name = field.Names[0].Name
	}

	return param
}

func parseFunction(fd *ast.FuncDecl, level int) *Function {
	name := fd.Name.Name

	params := []*Parameter{}
	for _, field := range fd.Type.Params.List {
		param := parseField(field)
		params = append(params, param)
	}

	results := []string{}
	for _, field := range fd.Type.Results.List {
		f := parseField(field)
		results = append(results, f.Type)
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

		level := 0
		f := parseFunction(fd, level)
		println(f.String())
	}
}
