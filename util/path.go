// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package util

import (
	"fmt"
	"io/ioutil"
	"os"
	"path"
	"path/filepath"
	"strings"
)

func filterFile(name string) bool {
	return strings.HasSuffix(name, ".txt") || strings.HasSuffix(name, ".csv")
}

func ListFileIds(path string) []string {
	res := []string{}

	files, err := ioutil.ReadDir(path)
	if err != nil {
		panic(err)
	}

	for _, f := range files {
		if !f.IsDir() && filterFile(f.Name()) {
			fileId := strings.TrimSuffix(f.Name(), filepath.Ext(f.Name()))
			res = append(res, fileId)
		}
	}

	return res
}

func FileExist(path string) bool {
	if _, err := os.Stat(path); os.IsNotExist(err) {
		return false
	}
	return true
}

func EnsureFileFolderExists(path string) {
	p := GetPath(path)
	if !FileExist(p) {
		err := os.MkdirAll(p, os.ModePerm)
		if err != nil {
			panic(err)
		}
	}
}

func GetPath(path string) string {
	return filepath.Dir(path)
}

func JoinUrl(base string, paths ...string) string {
	p := path.Join(paths...)
	return fmt.Sprintf("%s/%s", strings.TrimRight(base, "/"), strings.TrimLeft(p, "/"))
}
