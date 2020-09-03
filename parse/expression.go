// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package parse

import (
	"fmt"
	"strings"
)

type Expression struct {
	Type string
	Name string

	Inside *Expression
}

func (expr *Expression) String() string {
	//return fmt.Sprintf("%s:%s", expr.Type, expr.Name)

	if expr.Type == "parentheses" {
		return fmt.Sprintf("(%s)", expr.Inside)
	} else {
		return expr.Name
	}
}

type Expressions []*Expression

func (exprs Expressions) String() string {
	res := []string{}
	for _, expr := range exprs {
		res = append(res, expr.String())
	}
	return strings.Join(res, ", ")
}
