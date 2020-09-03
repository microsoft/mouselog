// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package parse

import (
	"fmt"
	"strings"
)

type Statement struct {
	Level int
	Name  string
	Args  Expressions

	Init *Statement
	Cond *Expression
	Post *Statement
	Body []*Statement
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
	} else if stmt.Name == "break" || stmt.Name == "continue" {
		// Input: break
		// Output: break
		res = stmt.Name
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
