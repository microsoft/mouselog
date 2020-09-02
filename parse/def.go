// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package parse

import (
	"fmt"
	"strings"
)

type Parameter struct {
	Type string
	Name string
}

func (param *Parameter) String() string {
	return fmt.Sprintf("%s:%s", param.Type, param.Name)
}

type Parameters []*Parameter

func (params Parameters) String() string {
	res := []string{}
	for _, param := range params {
		res = append(res, param.String())
	}
	return strings.Join(res, ", ")
}

type Function struct {
	Name       string
	Params     Parameters
	Results    []string
	Statements []*Statement
}

func (f *Function) String() string {
	res := []string{}
	declaration := fmt.Sprintf("%s %s(%s)", strings.Join(f.Results, ", "), f.Name, f.Params.String())
	res = append(res, declaration)

	for _, stmt := range f.Statements {
		res = append(res, stmt.String())
	}

	return strings.Join(res, "\n")
}

type Statement struct {
	Name string
	Args Parameters
}

func (stmt *Statement) String() string {
	args := []string{}
	for _, arg := range stmt.Args {
		args = append(args, arg.String())
	}
	return fmt.Sprintf("%s(%s)", stmt.Name, stmt.Args.String())
}
