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
	i := 0
	for scanner.Scan() {
		row := strings.SplitN(scanner.Text(), " ", RowLabel + 1)

		no := row[RowNo]
		trace := row[RowTrace]
		//target := row[RowTarget]
		label := row[RowLabel]

		if label == "0" {
			ss.IsBot = 1
		} else {
			ss.IsBot = 0
		}

		es := newEvents(no)
		points := strings.Split(trace, ";")
		for _, point := range points {
			if point == "" {
				continue
			}

			tokens := strings.Split(point, ",")
			x := util.ParseInt(tokens[0])
			y := util.ParseInt(tokens[1])
			t := util.ParseFloat(tokens[2])

			es.addEvent(t, x, y)
		}

		ss.AddEvents(es)

		if i % 1000 == 0 {
			fmt.Printf("[%d] Read trace a line\n", i)
		}

		i += 1
	}

	if err := scanner.Err(); err != nil {
		panic(err)
	}

	return ss
}
