// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package parse

import (
	"go/ast"
	"go/parser"
	"go/token"
	"log"
)

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
