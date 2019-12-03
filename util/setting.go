package util

func GetDataPath(fileId string) string {
	return CacheDir + "mouselog/" + fileId + ".txt"
}

func GetCsvDataPath(fileId string) string {
	return CacheDir + "mouselog/" + fileId + ".csv"
}
