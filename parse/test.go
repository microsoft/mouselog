package parse

import "fmt"

func test(a string, bb []*int) int {
	fmt.Printf("Hello, World!\n")
	res := 0
	array := []int{1, 2}
	for i := 0; i < 10; i++ {
		res += 10 / 2
		array = append(array, 1)
		if res != 10 && (array[0] >= 10 || *bb[3] == 5) {
			continue
		}
	}

	return res
}
