// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package trace

import (
	"fmt"
	"net/url"
	"strings"

	"github.com/microsoft/mouselog/screenshot"
	"github.com/microsoft/mouselog/util"
)

type Page struct {
	Id          string `xorm:"varchar(100) notnull pk" json:"id"`
	WebsiteId   string `xorm:"varchar(100)" json:"websiteId"`
	UrlPath     string `xorm:"varchar(500)" json:"urlPath"`
	CreatedTime string `xorm:"varchar(100)" json:"createdTime"`

	Width         int    `json:"width"`
	Height        int    `json:"height"`
	ScreenshotUrl string `xorm:"varchar(500)" json:"screenshotUrl"`
}

func GetPages(websiteId string) []*Page {
	pages := []*Page{}
	err := ormManager.engine.Where("website_id = ?", websiteId).Asc("created_time").Find(&pages)
	if err != nil {
		panic(err)
	}

	return pages
}

func GetPage(id string) *Page {
	s := Page{Id: id}
	existed, err := ormManager.engine.Get(&s)
	if err != nil {
		panic(err)
	}

	if existed {
		return &s
	} else {
		return nil
	}
}

func UpdatePage(id string, page *Page) bool {
	if GetPage(id) == nil {
		return false
	}

	_, err := ormManager.engine.Id(id).AllCols().Update(page)
	if err != nil {
		panic(err)
	}

	//return affected != 0
	return true
}

func addPage(id string, websiteId string, urlPath string) bool {
	s := Page{Id: id, WebsiteId: websiteId, CreatedTime: getCurrentTime(), UrlPath: urlPath}
	affected, err := ormManager.engine.Insert(s)
	if err != nil && !strings.Contains(err.Error(), "Duplicate entry") {
		panic(err)
	}

	return affected != 0
}

func AddPage(page *Page) bool {
	affected, err := ormManager.engine.Insert(page)
	if err != nil {
		panic(err)
	}

	return affected != 0
}

func DeletePage(id string) bool {
	affected, err := ormManager.engine.Id(id).Delete(&Page{})
	if err != nil {
		panic(err)
	}

	return affected != 0
}

func (p *Page) takeScreenshot() {
	website := GetWebsite(p.WebsiteId)
	screenshotUrl := util.JoinUrl(website.Url, p.UrlPath)
	screenshotId := url.PathEscape(p.Id)

	filePathName := util.GetScreenshotPath(p.WebsiteId, screenshotId)
	util.EnsureFileFolderExists(filePathName)
	screenshot.TakeScreenshot(screenshotUrl, filePathName)

	p.ScreenshotUrl = util.GetScreenshotUrl(p.WebsiteId, url.PathEscape(screenshotId))
	UpdatePage(p.Id, p)

	fmt.Printf("Generate screenshot: (%s, %s) => %s\n", p.WebsiteId, p.Id, filePathName)
}
