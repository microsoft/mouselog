// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package trace

import "testing"

func TestReadTraces(t *testing.T) {
	ss := ReadTraces("dsjtzs_txfz_training")
	print(ss)
}
