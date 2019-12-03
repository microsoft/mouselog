package trace

import (
	"bufio"
	"fmt"
	"os"
	"strings"

	"github.com/mouselog/mouselog/util"
)

func getFloor(i int) int {
	i = i - i % 100 - 100
	if i < 0 {
		i = 0
	}
	return i
}

func getCeil(i int) int {
	return i - i % 100 + 200
}

func normalizeWidthAndHeight(t *Trace, maxX int, minX int, maxY int, minY int) {
	t.Width = getCeil(maxX)
	t.Height = getCeil(maxY)

	floorX := getFloor(minX)
	floorY := getFloor(minY)
	for i := 0; i < len(t.Events); i++ {
		t.Events[i].X -= floorX
		t.Events[i].Y -= floorY
	}
	t.Width -= floorX
	t.Height -= floorY
}

func ReadTraces(fileId string) *Session {
	fmt.Printf("Read traces for file: [%s].\n", fileId)

	var path string
	var readLine func(*Session, string, int)
	path = util.GetDataPath(fileId)
	readLine = readTxtLine
	if strings.HasPrefix(fileId, "logs_") {
		path = util.GetCsvDataPath(fileId)
		readLine = readCsvLine
	}

	ss := NewSession(fileId)

	file, err := os.Open(path)
	if err != nil {
		panic(err)
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	const maxCapacity = 1024 * 1024 * 8
	buf := make([]byte, maxCapacity)
	scanner.Buffer(buf, maxCapacity)
	i := 0
	for scanner.Scan() {
		line := scanner.Text()

		readLine(ss, line, i)
	}

	if err := scanner.Err(); err != nil {
		panic(err)
	}

	return ss
}
