// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package controllers

import (
	"path/filepath"

	"github.com/microsoft/mouselog/detect"
	"github.com/microsoft/mouselog/object"
	"github.com/microsoft/mouselog/util"
)

var datasets map[string]*object.Session

func init() {
	datasets = map[string]*object.Session{}
}

func listDatasets(path string) []*object.Session {
	if !util.FileExist(path) {
		return []*object.Session{}
	}

	fileIds := util.ListFileIds(path)
	for _, fileId := range fileIds {
		if s, isNew := GetOrCreateDataset(fileId); isNew {
			syncDataset(s)
		}
	}

	m := map[string]interface{}{}
	for k, v := range datasets {
		m[k] = v
	}
	kv := util.SortMapsByKey(&m)

	res := []*object.Session{}
	for _, v := range *kv {
		res = append(res, v.Key.(*object.Session))
	}
	return res
}

func syncDataset(s *object.Session) {
	detect.SyncGuesses(s)
	s.SyncStatistics()
}

func (c *ApiController) ListDatasets() {
	res := []*object.SessionJson{}

	path := filepath.Join(util.CacheDir, "mouselog")
	datasets := listDatasets(path)
	for _, ss := range datasets {
		res = append(res, ss.ToJson(detect.RuleUpperLimit))
	}

	c.Data["json"] = res
	c.ServeJSON()
}

// GetOrCreateDataset either returns an already existing session or creates and returns a new one.
// If a new session has been created, the returned boolean will be true.
func GetOrCreateDataset(sessionId string) (*object.Session, bool) {
	if val, ok := datasets[sessionId]; ok {
		return val, false
	}

	datasets[sessionId] = object.NewSession(sessionId)
	return datasets[sessionId], true
}
