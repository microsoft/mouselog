// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package parse

import "go/ast"

func parseIdentifierNameType(nameType *ast.Ident) string {
	return nameType.Name
}

func parseArrayNameType(nameType *ast.ArrayType) string {
	return nameType.Elt.(*ast.Ident).Name + "*"
}

func parseNameType(nameType *ast.Expr) string {
	e, ok := (*nameType).(*ast.Ident)
	if ok {
		return parseIdentifierNameType(e)
	}

	e2, ok := (*nameType).(*ast.ArrayType)
	if ok {
		return parseArrayNameType(e2)
	}

	panic("parseNameType(): unknown name type")
}
