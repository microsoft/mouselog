// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package batch

import (
	"testing"

	"github.com/microsoft/mouselog/object"
)

func TestReadTraces(t *testing.T) {
	object.InitOrmManager()
	object.InitMapMutexes()

	//ReadTraces("dsjtzs_txfz_training")
	//ReadTraces("logs_20200127_slapi_coupon_bot")
	//ReadTraces("logs_20200503_afd_mouselog_url_output_joined_bot_top10000")
	//ReadTraces("logs_20200515_afd_mouselog_boxmodel_output_joined_bot_top1000")
	//ReadTraces("captcha_data_test_100_100")
	//ReadTraces("logs_20200624_boxmodel_cialis_case")
	//ReadTraces("logs_20200515_boxmodel_human_top1000")
	ReadTraces("logs_20200820_boxmodel_cache_bot")
}
