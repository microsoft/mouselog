package parse

import (
	"fmt"

	"github.com/microsoft/mouselog/object"
)

func test(a string, events []*object.Event) (int, string) {
	fmt.Printf("Hello, World!\n")
	res := 0
	array := []int{1, 2}
	for i := 0; i < 10; i++ {
		res += 10 / 2
		array = append(array, 1)
		if res != 10 && (array[0] >= 10 || events[3].X == 5) {
			continue
		}
	}

	return res, a
}
