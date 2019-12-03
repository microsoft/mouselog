package util

import (
	"io/ioutil"
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
