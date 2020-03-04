// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package batch

import "testing"

func TestReadTraces(t *testing.T) {
	//ss := ReadTraces("dsjtzs_txfz_training")
	ss := ReadTraces("logs_20200127_slapi_coupon_bot")
	print(ss)
}
