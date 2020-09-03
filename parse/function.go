// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package parse

import (
	"fmt"
	"strings"
)

type Function struct {
	Level      int
	Name       string
	Params     Expressions
	Results    []string
	Statements []*Statement
}

func (f *Function) String() string {
	res := ""

	declaration := fmt.Sprintf("%s %s(%s)", strings.Join(f.Results, ", "), f.Name, f.Params.String())

	list := []string{}
	list = append(list, declaration)
	for _, stmt := range f.Statements {
		list = append(list, stmt.String())
	}

	res = strings.Join(list, "\n")

	indent := getIndent(f.Level)
	if IsVerbose {
		return fmt.Sprintf("%s<func>%s</func>", indent, res)
	} else {
		return fmt.Sprintf("%s%s", indent, res)
	}
}
