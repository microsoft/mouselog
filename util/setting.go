package util

import "path/filepath"

func GetDataPath(fileId string) string {
	return filepath.Join(CacheDir, "mouselog", fileId+".txt")
}

func GetCsvDataPath(fileId string) string {
	return filepath.Join(CacheDir, "mouselog", fileId+".csv")
}
