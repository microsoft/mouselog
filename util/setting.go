// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package util

import "fmt"

func GetDataPath(fileId string) string {
	return CacheDir + "mouselog/" + fileId + ".txt"
}

func GetCsvDataPath(fileId string) string {
	return CacheDir + "mouselog/" + fileId + ".csv"
}

func GetScreenshotPath(websiteId string, escapedPageId string) string {
	return fmt.Sprintf("../static/screenshots/%s/%s.png", websiteId, escapedPageId)
}

func GetScreenshotUrl(websiteId string, escapedPageId string) string {
	return fmt.Sprintf("https://mouselog.org/screenshots/%s/%s.png", websiteId, escapedPageId)
}
