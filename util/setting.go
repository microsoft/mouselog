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

func GetTsvDataPath(fileId string) string {
	return CacheDir + "mouselog/" + fileId + ".tsv"
}

func GetScreenshotPath(websiteId string, screenshotId string) string {
	return fmt.Sprintf("../static/screenshots/%s/%s.png", websiteId, screenshotId)
}

func GetScreenshotUrl(websiteId string, screenshotId string) string {
	return fmt.Sprintf("https://mouselog.org/screenshots/%s/%s.png", websiteId, screenshotId)
	//return fmt.Sprintf("http://localhost:9000/screenshots/%s/%s.png", websiteId, screenshotId)
}
