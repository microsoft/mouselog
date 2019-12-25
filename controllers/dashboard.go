package controllers

import (
	"fmt"
	"strconv"

	"github.com/microsoft/mouselog/detect"
	"github.com/microsoft/mouselog/fileutils"
	"github.com/microsoft/mouselog/trace"
	"github.com/microsoft/mouselog/util"
)

func getOrCreateSs2(fileId string) *trace.Session {
	var ss *trace.Session

	if _, ok := ssm[fileId]; ok {
		ss = ssm[fileId]
	} else {
		ss = trace.ReadTraces(fileId)
		ssm[fileId] = ss

		detect.SyncGuesses(ss)
		ss.SyncStatistics()
	}

	return ss
}

func listTraceFiles(path string) []*trace.Session {
	res := []*trace.Session{}

	if util.FileExist(path) {
		for _, fileId := range util.ListFileIds(path) {
			getOrCreateSs2(fileId)
		}
	}

	m := map[string]interface{}{}
	for k, v := range ssm {
		m[k] = v
	}
	kv := util.SortMapsByKey(&m)
	for _, v := range *kv {
		res = append(res, v.Key.(*trace.Session))
	}

	return res
}

func (c *ApiController) ListSessions() {
	sss := listTraceFiles(util.CacheDir + "mouselog/")
	res := []*trace.SessionJson{}
	for _, ss := range sss {
		res = append(res, ss.ToJson())
	}

	c.Data["json"] = res
	c.ServeJSON()
}

func (c *ApiController) ListTraces() {
	fileId := c.Input().Get("fileId")
	perPage := util.ParseInt(c.Input().Get("perPage"))
	page := util.ParseInt(c.Input().Get("page"))
	ss := getOrCreateSs2(fileId)

	last := perPage * (page + 1)
	if last > len(ss.Traces) {
		last = len(ss.Traces)
	}
	table := ss.Traces[(perPage * page):last]

	c.Data["json"] = map[string]interface{}{
		"traces": table,
		"page":   page,
		"total":  len(ss.Traces),
	}
	c.ServeJSON()
}

func (c *ApiController) GetTrace() {
	fileId := c.Input().Get("fileId")
	traceId := util.ParseInt(c.Input().Get("traceId"))
	ss := getOrCreateSs2(fileId)

	c.Data["json"] = ss.Traces[traceId]
	c.ServeJSON()
}

func (c *ApiController) UploadFile() {
	sessionId := c.StartSession().SessionID()
	fmt.Printf("[SessionId %s]\n", sessionId)

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
				ss := getOrCreateSs(header.Filename)
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
