package fileutils

import (
	"encoding/json"
	"io/ioutil"
	"mime/multipart"

	"github.com/microsoft/mouselog/trace"
)

type JsonFile struct {
	Data []trace.Trace `json:"data"`
}

func JsonParser(file multipart.File) (traces []trace.Trace, errMsg string) {
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
