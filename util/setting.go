// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package util

func GetDataPath(fileId string) string {
	return CacheDir + "mouselog/" + fileId + ".txt"
}

func GetCsvDataPath(fileId string) string {
	return CacheDir + "mouselog/" + fileId + ".csv"
}
