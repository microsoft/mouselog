// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package parse

import "go/ast"

func parseIdentifierNameType(nameType *ast.Ident) string {
	// Normal type like:
	// int, string, ..
	return nameType.Name
}

func parseArrayNameType(nameType *ast.ArrayType) string {
	// Array type like:
	// []int
	return parseNameType(&nameType.Elt) + "*"
}

func parseStarNameType(nameType *ast.StarExpr) string {
	// Star type like:
	// *int
	return parseNameType(&nameType.X) + "*"
}

func parseSelectorNameType(expr *ast.SelectorExpr) string {
	// Selector type like:
	// object.Event
	return parseSelectorExpression(expr).String()
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

	e3, ok := (*nameType).(*ast.StarExpr)
	if ok {
		return parseStarNameType(e3)
	}

	e4, ok := (*nameType).(*ast.SelectorExpr)
	if ok {
		return parseSelectorNameType(e4)
	}

	panic("parseNameType(): unknown name type")
}
