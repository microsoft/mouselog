package parse

import "fmt"

func test(a string, b int) int {
	fmt.Printf("Hello, Golang\n")
	res := 0
	for i := 0; i < 10; i++ {
		res += 10
	}
	return res
}
