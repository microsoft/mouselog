// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package trace

import (
	"testing"

	"github.com/microsoft/mouselog/crawler"
)

func TestPageScreenshot(t *testing.T) {
	InitOrmManager()

	pages := GetPages("casbin")
	for _, page := range pages {
		page.takeScreenshot()
	}
}

func TestCrawl(t *testing.T) {
	InitOrmManager()

	website := GetWebsite("casbin")
	pageIds := crawler.CrawlWebsite(website.Url)
	for _, pageId := range pageIds {
		addPage(pageId, website.Id, pageId)
	}
}
