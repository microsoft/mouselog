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
	//return fmt.Sprintf("%s:%s", param.Type, param.Name)
	return fmt.Sprintf("%s", param.Name)
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
	Level      int
	Name       string
	Params     Parameters
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

type Statement struct {
	Level int
	Name  string
	Args  Parameters

	Init *Statement
	Cond *Parameter
	Post *Statement
	Body []*Statement
}

func getIndent(level int) string {
	if level == 0 {
		return ""
	} else if level == 1 {
		return "    "
	} else if level == 2 {
		return "        "
	} else if level == 3 {
		return "            "
	} else {
		panic("getIndent(): not supported level")
	}
}

func (stmt *Statement) String() string {
	res := ""
	if stmt.Name == ":=" {
		// Input: res := 0
		// Output: int res = 0
		res = fmt.Sprintf("%s %s = %s", stmt.Args[1].Type, stmt.Args[0].Name, stmt.Args[1])
	} else if stmt.Name == "=" {
		// Input: res = 5
		// Output: res = 5
		res = fmt.Sprintf("%s = %s", stmt.Args[0], stmt.Args[1])
	} else if stmt.Name == "for" {
		// Input: for i := 0; i < 10; i++
		// Output: for (int i = 0; i < 10; xxx)
		init := stmt.Init.String()
		cond := stmt.Cond.String()
		post := stmt.Post.String()
		declaration := fmt.Sprintf("for (%s; %s; %s)", init, cond, post)

		list := []string{}
		list = append(list, declaration)
		for _, stmt := range stmt.Body {
			list = append(list, stmt.String())
		}

		res = strings.Join(list, "\n")
	} else if stmt.Name == "if" {
		// Input: if res != 10
		// Output: if (res != 10)
		cond := stmt.Cond.String()
		declaration := fmt.Sprintf("if (%s)", cond)

		list := []string{}
		list = append(list, declaration)
		for _, stmt := range stmt.Body {
			list = append(list, stmt.String())
		}

		res = strings.Join(list, "\n")
	} else if stmt.Name == "+=" || stmt.Name == "-=" {
		// Input: res += 10
		// Output: res += 10
		res = fmt.Sprintf("%s %s %s", stmt.Args[0], stmt.Name, stmt.Args[1])
	} else if stmt.Name == "++" || stmt.Name == "--" {
		// Input: i++
		// Output: i ++
		res = fmt.Sprintf("%s %s", stmt.Args[0], stmt.Name)
	} else {
		// Input: fmt.Printf("Hello, World!\n")
		// Output: fmt.Printf("Hello, World!\n")
		args := []string{}
		for _, arg := range stmt.Args {
			args = append(args, arg.String())
		}
		res = fmt.Sprintf("%s(%s)", stmt.Name, stmt.Args.String())
	}

	indent := getIndent(stmt.Level)
	if IsVerbose {
		return fmt.Sprintf("%s<stmt>%s</stmt>", indent, res)
	} else {
		return fmt.Sprintf("%s%s", indent, res)
	}
}
