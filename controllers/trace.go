// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package controllers

import (
	"fmt"
	"strconv"

	"github.com/microsoft/mouselog/fileutils"
	"github.com/microsoft/mouselog/util"
)

func (c *APIController) ListTraces() {
	perPage := util.ParseInt(c.Input().Get("perPage"))
	page := util.ParseInt(c.Input().Get("page"))
	session, isNew := GetOrCreateDataset(c.Input().Get("fileId"))
	if isNew {
		syncDataset(session)
	}

	last := perPage * (page + 1)
	if last > len(session.Traces) {
		last = len(session.Traces)
	}
	table := session.Traces[(perPage * page):last]

	c.Data["json"] = map[string]interface{}{
		"traces": table,
		"page":   page,
		"total":  len(session.Traces),
	}
	c.ServeJSON()
}

func (c *APIController) GetTrace() {
	session, isNew := GetOrCreateDataset(c.Input().Get("fileId"))
	if isNew {
		syncDataset(session)
	}

	c.Data["json"] = session.Traces[util.ParseInt(c.Input().Get("traceId"))]
	c.ServeJSON()
}

func (c *APIController) UploadFile() {
	fmt.Printf("[SessionId %s]\n", c.StartSession().SessionID())

	fileCount := 0
	success := 0
	message := ""

	for {
		fmt.Println("file" + strconv.Itoa(fileCount))
		_, header, err := c.GetFile("file" + strconv.Itoa(fileCount))
		if err != nil {
			break
		}
		filename := header.Filename
		file, err := header.Open()
		if err != nil {
			panic(err)
		}

		traces, errMsg := fileutils.JsonParser(file)
		if errMsg != "" {
			message += fmt.Sprintf("\n%s: %s", filename, errMsg)
			success = -1
		} else {
			for _, trace := range traces {
				// Use Filename as SessionId
				ss, _ := GetOrCreateDataset(header.Filename)
				if len(trace.Events) != 0 {
					ss.AddTrace(&trace)
				}
			}
		}
		fmt.Printf("[Filename: %s]\n", header.Filename)
		fileCount++
	}

	c.Data["json"] = map[string]interface{}{
		"success": success,
		"message": message,
	}
	c.ServeJSON()
}
