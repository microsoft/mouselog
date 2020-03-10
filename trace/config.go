// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package trace

import "encoding/json"

type TrackConfig struct {
	EndpointType   string `json:"endpointType"`
	UploadEndpoint string `json:"uploadEndpoint"`

	UploadMode   string `json:"uploadMode"`
	UploadPeriod int    `json:"uploadPeriod"`
	Frequency    int    `json:"frequency"`

	Encoder        string `json:"encoder"`
	Decoder        string `json:"decoder"`
	EnableGet      bool   `json:"enableGet"`
	ResendInterval int    `json:"resendInterval"`
	SizeLimit      int    `json:"sizeLimit"`
}

func ParseTrackConfig(s string) TrackConfig {
	var config TrackConfig
	err := json.Unmarshal([]byte(s), &config)
	if err != nil {
		panic(err)
	}

	return config
}
