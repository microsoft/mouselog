package trace

import (
	"bufio"
	"fmt"
	"os"
	"strings"

	"github.com/mouselog/mouselog/util"
)

const (
	RowNo = iota
	RowTrace
	RowTarget
	RowLabel
)

func ReadTraces(fileId string) *Session {
	fmt.Printf("Read traces for file: [%s].\n", fileId)

	ss := NewSession(fileId)

	path := util.GetDataPath(fileId)
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
		row := strings.SplitN(line, " ", RowLabel+1)

		no := row[RowNo]
		trace := row[RowTrace]
		//target := row[RowTarget]

		t := newTrace(no)

		if len(row) == RowLabel+1 {
			label := row[RowLabel]
			if label == "0" {
				t.IsBot = 1
			} else {
				t.IsBot = 0
			}
		}
		points := strings.Split(trace, ";")
		maxX := 0
		maxY := 0
		for _, point := range points {
			if point == "" {
				continue
			}

			tokens := strings.Split(point, ",")
			x := util.ParseInt(tokens[0])
			if maxX < x {
				maxX = x
			}
			y := util.ParseInt(tokens[1])
			if maxY < y {
				maxY = y
			}
			timestamp := util.ParseFloat(tokens[2])

			t.addEvent(timestamp, x, y)
		}

		t.Width = maxX
		t.Height = maxY
		ss.AddTrace(t)

		if i%1000 == 0 {
			fmt.Printf("[%d] Read trace a line\n", i)
		}

		i += 1
	}

	if err := scanner.Err(); err != nil {
		panic(err)
	}

	return ss
}
