// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package detect

import (
	"fmt"
	"testing"
)

func TestGetRadian(t *testing.T) {
	fmt.Println(getRadian(1, 1, 1, 1))  // 0
	fmt.Println(getRadian(1, 0, 1, 1))  // 45
	fmt.Println(getRadian(1, 1, 1, 0))  // 45
	fmt.Println(getRadian(0, 1, 1, 0))  // 90
	fmt.Println(getRadian(0, 1, 0, -1)) // 180: 3.1415926..
}
