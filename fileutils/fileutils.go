// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package fileutils

import (
	"encoding/json"
	"io/ioutil"
	"mime/multipart"

	"github.com/microsoft/mouselog/object"
)

type JsonFile struct {
	Data []object.Trace `json:"data"`
}

func JsonParser(file multipart.File) (traces []object.Trace, errMsg string) {
	content, err := ioutil.ReadAll(file)
	if err != nil {
		panic(err)
	}
	defer file.Close()
	t := JsonFile{}
	err = json.Unmarshal(content, &t)
	if err != nil {
		return nil, "Cannot decode JSON file."
	}
	traces = t.Data
	return traces, ""
}
