package util

import (
	"io/ioutil"
	"strings"
)

func filterTxtFile(name string) bool {
	return strings.HasSuffix(name, ".txt")
}

func ListFileIds(path string) []string {
	res := []string{}

	files, err := ioutil.ReadDir(path)
	if err != nil {
		panic(err)
	}

	for _, f := range files {
		if !f.IsDir() && filterTxtFile(f.Name()) {
			fileId := strings.TrimSuffix(f.Name(), ".txt")
			res = append(res, fileId)
		}
	}

	return res
}
