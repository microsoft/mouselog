// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package batch

import (
	"testing"

	"github.com/microsoft/mouselog/trace"
)

func TestReadTraces(t *testing.T) {
	trace.InitOrmManager()
	trace.InitMapMutexes()

	//ReadTraces("dsjtzs_txfz_training")
	ReadTraces("logs_20200127_slapi_coupon_bot")
}
